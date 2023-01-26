import { EtatJeu, EtatJeuInitial, Grille, Jouer, Pion } from './data';

function* gen(nb: number) {
  for (let i = 0; i < nb; i++) {
    yield i;
  }
}

interface EtatUI {
  etat: EtatJeu;
  table: HTMLTableElement;
}

export function CréerInterfaceEtat(etat: EtatJeu): EtatUI {
  // création d'une tablea HTML pour rprster la grille + s'abonner aux évènements pour jouer
  const table = document.createElement('table');
  const str = `
    <thead>
        <td colspan="7">Au tour du joueur 1 (rouge)</td>
    </thead>
    <tbody>
      ${[...gen(6)]
        .map(
          (ligne) => `
      <tr>
        ${[...gen(7)]
          .map(
            (col) => `
          <td class = "C${col}">
            <div></div>
          </td>
        `
          )
          .join('')}
      </tr>`
        )
        .join('')}
    </tbody>
    <caption>
      <button> Recommencer une partie </button>
    </caption>
  `;

  table.innerHTML = str;
  const etatUI: EtatUI = { etat, table };

  const btRecommencer = table.querySelector('caption > button');
  if (btRecommencer) {
    btRecommencer.addEventListener('click', () => {
      console.log('On redémarre');
      const parent = etatUI.table.parentElement;
      etatUI.table.remove();
      const ui = CréerInterfaceEtat(EtatJeuInitial());
      parent?.appendChild(ui.table);
    });
  }

  table.querySelectorAll('tbody td').forEach((td: HTMLElement) => {
    const parent = td.parentElement;
    const i = [...parent.children].indexOf(td);

    td.onpointerup = () => {
      etatUI.etat = Jouer(etatUI.etat, i);
      UpdateInterfaceEtat(etatUI, etatUI.etat);
      console.log(etatUI);
      //coup gagnant ?
      let gagnant: undefined | Pion = Gagnant(etatUI.etat, i);
      if (gagnant) {
        table.querySelectorAll('td').forEach((TD) => {
          TD.onpointerup = TD.onpointerenter = undefined;
          table.tHead.querySelector('td')!.textContent = `
          Le gagnant est ${gagnant}`;
        });
      }
    };

    td.onpointerenter = () => {
      for (const td of table.querySelectorAll(
        `tbody tr > td:nth-child(${i + 1})`
      )) {
        td.classList.add('playable');
      }
    };
    td.onpointerleave = () => {
      for (const td of table.querySelectorAll('td')) {
        td.classList.remove('playable');
      }
    };
  });

  return etatUI;
}

export function UpdateInterfaceEtat(ui: EtatUI, etat: EtatJeu): EtatUI {
  ui.table.tHead.querySelector('td').textContent = `
    Au tour du joueur ${etat.tour == 'J1' ? 'J1 (rouge)' : 'J2 (jaune)'}`;

  //on vide la grille de toutes les pièces de chaque joueur
  ui.table.querySelectorAll('td > div').forEach((td) => {
    td.classList.remove('J1');

    td.classList.remove('J2');
  });

  etat.grille.forEach((P, pile) => {
    P.forEach((c, line) => {
      const td = ui.table.querySelector(
        `tr:nth-child(${6 - line}) > td:nth-child(${pile + 1}) > div`
      );
      console.log('update', td, 'with', c);
      td?.classList.add(c);
    });
  });
  return ui;
}

export function Gagnant(e: EtatJeu, col: number): undefined | Pion {
  let j = e.grille[col][e.grille[col].length - 1];
  const direction = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ];
  let gagnant: undefined | Pion = undefined;
  direction.forEach((d) => {
    let compteur = 1;
    let sens = [1, -1];
    sens.forEach((s) => {
      const [dx, dy] = d.map((x) => s * x);
      let c = col + dx;
      let l = dy;
      while (e.grille[c]?.[e.grille[col].length - 1 + l] == j) {
        compteur += 1;
        c += dx;
        l += dy;
      }
      if (compteur >= 4) {
        gagnant = j;
      }
    });
  });
  return gagnant;
}
