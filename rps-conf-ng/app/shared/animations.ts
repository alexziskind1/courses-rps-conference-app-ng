import { trigger, style, animate, state, transition } from '@angular/core';

export var slideInAnimations = [
    trigger('slideIn', [
        state('on', style({ transform: 'translate(0, 0)', opacity: 1 })),
        state('off', style({ transform: 'translate(-20, 0)', opacity: 0 })),
        transition('off => on', animate(600)),
        transition('* => on', [
            style({ transform: 'translate(20, 0)', opacity: 0 }),
            animate(600)
        ])
    ])
];