import './style.scss';
import {EtatJeuInitial} from './data';

import { of, map, Observable } from 'rxjs';
import { CréerInterfaceEtat } from './interface';

// Open the console in the bottom right to see results.

let grille = EtatJeuInitial();
let grilleUI = CréerInterfaceEtat(grille);

document.body.appendChild(grilleUI.table);
