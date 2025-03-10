import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewEncapsulation
} from '@angular/core';
import {Platform} from '@angular/cdk/platform';

@Component({
  selector: 'ktb-copy-to-clipboard[value][label]',
  templateUrl: './ktb-copy-to-clipboard.component.html',
  styleUrls: ['./ktb-copy-to-clipboard.component.scss'],
  host: {
    class: 'ktb-copy-to-clipboard',
    '[attr.aria-visible]': 'visible',
    '[class.ktb-copy-input-visible]': 'visible',
  },
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KtbCopyToClipboardComponent {
  @Input() public value = '';
  @Input() public label = '';

  public visible = false;

  constructor(private _changeDetectorRef: ChangeDetectorRef, public platform: Platform) {}

}
