// Code generated by moq; DO NOT EDIT.
// github.com/matryer/moq

package fake

import (
	"github.com/keptn/keptn/shipyard-controller/models"
	"sync"
)

// ISequencePausedHookMock is a mock implementation of sequencehooks.ISequencePausedHook.
//
// 	func TestSomethingThatUsesISequencePausedHook(t *testing.T) {
//
// 		// make and configure a mocked sequencehooks.ISequencePausedHook
// 		mockedISequencePausedHook := &ISequencePausedHookMock{
// 			OnSequencePausedFunc: func(event models.Event)  {
// 				panic("mock out the OnSequencePaused method")
// 			},
// 		}
//
// 		// use mockedISequencePausedHook in code that requires sequencehooks.ISequencePausedHook
// 		// and then make assertions.
//
// 	}
type ISequencePausedHookMock struct {
	// OnSequencePausedFunc mocks the OnSequencePaused method.
	OnSequencePausedFunc func(event models.Event)

	// calls tracks calls to the methods.
	calls struct {
		// OnSequencePaused holds details about calls to the OnSequencePaused method.
		OnSequencePaused []struct {
			// Event is the event argument value.
			Event models.Event
		}
	}
	lockOnSequencePaused sync.RWMutex
}

// OnSequencePaused calls OnSequencePausedFunc.
func (mock *ISequencePausedHookMock) OnSequencePaused(event models.Event) {
	if mock.OnSequencePausedFunc == nil {
		panic("ISequencePausedHookMock.OnSequencePausedFunc: method is nil but ISequencePausedHook.OnSequencePaused was just called")
	}
	callInfo := struct {
		Event models.Event
	}{
		Event: event,
	}
	mock.lockOnSequencePaused.Lock()
	mock.calls.OnSequencePaused = append(mock.calls.OnSequencePaused, callInfo)
	mock.lockOnSequencePaused.Unlock()
	mock.OnSequencePausedFunc(event)
}

// OnSequencePausedCalls gets all the calls that were made to OnSequencePaused.
// Check the length with:
//     len(mockedISequencePausedHook.OnSequencePausedCalls())
func (mock *ISequencePausedHookMock) OnSequencePausedCalls() []struct {
	Event models.Event
} {
	var calls []struct {
		Event models.Event
	}
	mock.lockOnSequencePaused.RLock()
	calls = mock.calls.OnSequencePaused
	mock.lockOnSequencePaused.RUnlock()
	return calls
}
