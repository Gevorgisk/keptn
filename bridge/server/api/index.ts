import { NextFunction, Request, Response, Router } from 'express';
import { Method } from 'axios';
import { currentPrincipal } from '../user/session';
import { axios } from '../services/axios-instance';
import { DataService } from '../services/data-service';

const router = Router();

function apiRouter(params:
                     { apiUrl: string, apiToken: string, cliDownloadLink: string, integrationsPageLink: string, authType: string },
): Router {
  // fetch parameters for bridgeInfo endpoint
  const {apiUrl, apiToken, cliDownloadLink, integrationsPageLink, authType} = params;
  const enableVersionCheckFeature = process.env.ENABLE_VERSION_CHECK !== 'false';
  const showApiToken = process.env.SHOW_API_TOKEN !== 'false';
  const bridgeVersion = process.env.VERSION;
  const projectsPageSize = process.env.PROJECTS_PAGE_SIZE;
  const servicesPageSize = process.env.SERVICES_PAGE_SIZE;
  const keptnInstallationType = process.env.KEPTN_INSTALLATION_TYPE;
  const dataService = new DataService(apiUrl, apiToken);

  // bridgeInfo endpoint: Provide certain metadata for Bridge
  router.get('/bridgeInfo', async (req, res, next) => {
    const user = currentPrincipal(req);
    const bridgeInfo = {
      bridgeVersion,
      keptnInstallationType,
      apiUrl, ...showApiToken && {apiToken},
      cliDownloadLink,
      enableVersionCheckFeature,
      showApiToken,
      projectsPageSize,
      servicesPageSize,
      authType,
      ...user && {user},
    };

    try {
      return res.json(bridgeInfo);
    } catch (err) {
      return next(err);
    }
  });

  router.get('/integrationsPage', async (req, res, next) => {
    try {
      // @ts-ignore
      const result = await axios({
        method: req.method,
        url: `${integrationsPageLink}`,
      });
      return res.send(result.data);
    } catch (err) {
      return next(err);
    }
  });

  router.get('/swagger-ui/swagger.yaml', async (req, res, next) => {
    try {
      const result = await axios({
        method: req.method as Method,
        url: `${apiUrl}${req.url}`,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return res.json(result.data);
    } catch (err) {
      return next(err);
    }
  });

  router.get('/version.json', async (req, res, next) => {
    try {
      const result = await axios({
        method: req.method as Method,
        url: `https://get.keptn.sh/version.json`,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': `keptn/bridge:${process.env.VERSION}`,
        },
      });
      return res.json(result.data);
    } catch (err) {
      return next(err);
    }
  });

  router.get('/project/:projectName', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectName = req.params.projectName;
      const project = await dataService.getProject(projectName, req.query.remediation === 'true', req.query.approval === 'true');
      return res.json(project);
    } catch (error) {
      return next(error);
    }
  });

  router.get('/project/:projectName/tasks', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectName = req.params.projectName;
      const tasks = await dataService.getTasks(projectName);
      return res.json(tasks);
    } catch (error) {
      return next(error);
    }
  });

  router.post('/uniform/registration', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uniformDates: { [key: string]: string } = req.body;
      const uniformRegistrations = await dataService.getUniformRegistrations(uniformDates);
      return res.json(uniformRegistrations);
    } catch (error) {
      return next(error);
    }
  });

  router.get('/uniform/registration/:integrationId/isControlPlane', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isControlPlane = await dataService.getIsUniformRegistrationControlPlane(req.params.integrationId);
      return res.json(isControlPlane);
    } catch (error) {
      return next(error);
    }
  });

  router.get('/project/:projectName/service/:serviceName/files', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const serviceResources = await dataService.getResourceFileTreesForService(req.params.projectName, req.params.serviceName);
      return res.json(serviceResources);
    } catch (error) {
      return next(error);
    }
  });

  router.post('/hasUnreadUniformRegistrationLogs', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uniformDates: { [key: string]: string } = req.body;
      const status = await dataService.hasUnreadUniformRegistrationLogs(uniformDates);
      res.json(status);
    } catch (error) {
      return next(error);
    }
  });

  router.all('*', async (req, res, next) => {
    try {
      const result = await axios({
        method: req.method as Method,
        url: `${apiUrl}${req.url}`,
        ...req.method !== 'GET' && {data: req.body},
        headers: {
          'x-token': apiToken,
          'Content-Type': 'application/json',
        },
      });

      return res.json(result.data);
    } catch (err) {
      return next(err);
    }
  });

  return router;
}

export { apiRouter };
