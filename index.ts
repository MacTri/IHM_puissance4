import './style.scss';
import {EtatJeuInitial} from './data';

import { of, map, Observable } from 'rxjs';
import { CréerInterfaceEtat } from './interface';

of('World')
  .pipe(map((name) => `Hello, ${name}!`))
  .subscribe(console.log);

// Open the console in the bottom right to see results.

let grille = EtatJeuInitial();
let grilleUI = CréerInterfaceEtat(grille);

document.body.appendChild(grilleUI.table);
