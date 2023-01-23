import { EtatJeu, Grille, Jouer } from './data';

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
  `;

  table.innerHTML = str;

  const etatUI: EtatUI = { etat, table };

  table.querySelectorAll('td').forEach((td) => {
    const parent = td.parentElement;
    const i = [...parent.children].indexOf(td);

    td.onpointerup = () => {
      etatUI.etat = Jouer(etatUI.etat, i);
      UpdateInterfaceEtat(etatUI, etatUI.etat);
      console.log(etatUI);
    };

    td.onpointerenter = () => {
      for (const td of table.querySelectorAll(`tr > td:nth-child(${i + 1})`)) {
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

export function Victoire(etat : EtatJeu){
  

}
