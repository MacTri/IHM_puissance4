export type Pion = 'J1' | 'J2';

export type Grille = Pion[][];

export interface EtatJeu {
  grille: Grille;
  tour: Pion;
}

export function EtatJeuInitial(): EtatJeu {
  return {
    grille: [[], [], [], [], [], [], []],
    tour: 'J1',
  };
}

export function Jouer(etat: EtatJeu, colonne: number): EtatJeu {
  const { grille, tour } = etat;
  if (grille[colonne]?.length < 6) {
    grille[colonne].push(tour);
    return {
      grille,
      tour: tour == 'J1' ? 'J2' : 'J1',
    };
  }
  return etat;
}
