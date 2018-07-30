| :earth_africa: Translations                           |
| ----------------------------------------------------- |
| [:gb: English](/docs/user-guide/README.md)            |
| **[:fr: Français](/docs/user-guide/fr_FR/README.md)** |

# Guide utilisateur Draftail

Draftail est un éditeur prévu pour toutes sortes de sites et d’apps. Il vise une expérience utilisateur centrée sur l’usage du clavier, sans besoin d’utiliser la souris. La plupart des styles de texte peuvent être appliqués avec des raccourcis claviers standard, inspirés par [Google Docs](https://support.google.com/docs/answer/179738) et [Markdown](https://fr.wikipedia.org/wiki/Markdown).

Une caractéristique qui distingue Draftail des autres éditeurs est sa configurabilité: **les options de formattage disponibles peuvent différer d’une instance de l’éditeur à l’autre**, selon la configuration de chaque éditeur. Un pourrait n’autoriser que les liens. Un autre pourrait avoir les niveaux de titres, listes, et images.

## Table des matières

-   [Démo en ligne](#d%C3%A9mo-en-ligne)
-   [Support des navigateurs](#support-des-navigateurs)
-   [L’éditeur](#l%C3%A9diteur)
    -   [Utiliser les raccourcis clavier](#utiliser-les-raccourcis-clavier)
    -   [Copier-coller du contenu dans l’éditeur](#copier-coller-du-contenu-dans-l%C3%A9diteur)
-   [Liens, images, et plus](#liens-images-et-plus)
-   [Feedback](#feedback)
-   [Raccourcis clavier](#raccourcis-clavier)

## Démo en ligne

| [![Capture d’écran de Draftail](https://springload.github.io/draftail/static/draftail-ui-screenshot.png)](https://springload.github.io/draftail/)                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Le site Draftail a une chouette démo avec la plupart des fonctions par défaut. [Allez y jeter un œil et essayer l’éditeur!](https://springload.github.io/draftail/) |

## Support des navigateurs

Draftail supporte tous les navigateurs **bureau** modernes, dans leur version la plus récente:

| Navigateur | Système d’exploitation |
| ---------- | ---------------------- |
| Chrome     | Windows, macOS         |
| Firefox    | Windows, macOS         |
| MS Edge    | Windows                |
| Safari     | macOS                  |

Si votre navigateur n’est pas sur cette liste, les résultats vont varier. Regardez la [liste des problèmes connus](https://github.com/springload/draftail/issues/138), ou utilisez l’un des navigateurs supportés.

Pour les appareils mobiles, Draftail est testé dans la dernière version de iOS et Android. Le support est limité – il y a beaucoup de problèmes connus là aussi, en particuler avec des claviers custom comme le [clavier Google GBoard](https://play.google.com/store/apps/details?id=com.google.android.inputmethod.latin) ou [SwiftKey](https://swiftkey.com/).

## L’éditeur

Draftail est un éditeur simple. La barre d’outils contient toutes les options de formattage, et autres contrôles. Vous pouvez écrire en dessous.

![Capture d’écran de l’éditeur avec sa barre d’outils](/docs/user-guide/editor.png)

Chaque contrôle dans la barre d’outils vient avec sa propre tooltip, pour savoir l’usage exacte du bouton, ainsi que le raccourci clavier associé. Ici, le bouton "H3" est pour **Titre de niveau 3**.

![Capture d’écran de l’éditeur montrant les tooltips de la barre d’outils pour voir les raccourcis clavier](/docs/user-guide/toolbar-tooltip.png)

---

### Utiliser les raccourcis clavier

> Prenez un moment pour consulter la [liste complète des raccourcis clavier](#raccourcis-clavier).

Ce contrôle H3 utilise un raccourci similaire au [Markdown](https://en.wikipedia.org/wiki/Markdown) `###`. Vous pouvez activer le style de text H3 en tapant `###` suivi d’un espace au début d’une ligne:

![Capture d’écran de l’éditeur montrant les raccourcis Markdown](/docs/user-guide/markdown-shortcuts.gif)

Et biensûr, les raccourcis habituels pour des contrôles communs comme gras, undo/redo sont aussi disponibles:

![Capture d’écran de l’éditeur montrant les raccourcis communs](/docs/user-guide/classic-shortcuts.gif)

Voici un autre exemple de raccourci, `-` ou `*` pour listes à puce:

![Capture d’écran de l’éditeur avec raccourcis pour appliquer les listes à puce, et indenté/dé-indenter ou arrêter la liste](/docs/user-guide/list-item-shortcuts.gif)

Si les listes numérotées étaient disponibles dans cet éditeur, vous pourriez aussi utiliser `1.`. Dans l’éditeur ci-dessous, nous avons aussi activé les sauts de ligne et règles horizontales, qui ont aussi leur propre bouton et raccourci:

![Capture d’écran de l’éditeur montrant le support pour les sauts de lignes et règles horiontales avec les raccourcis correspondants](/docs/user-guide/line-breaks-horizontal-rules.gif)

Si vous oubliez le raccourci pour un contrôle donné, il est affiché dans la tooltip.

![Capture d’écran de l’éditeur avec une démo des boutons undo/redo et raccourcis clavier](/docs/user-guide/undo-redo.gif)

Ces raccourcis sont vraiment pratiques sur écrans tactiles, où il peut être difficile d’aller et venir entre la saisie de texte et la barre d’outils. Vous pouvez trouver la [liste complète des raccourcis supportés](#raccourcis-clavier) ci-dessous, qui seront disponibles à condition que le contrôle correspondant soit activé dans l’éditeur.

---

### Copier-coller du contenu dans l’éditeur

En collant du contenu dans un éditeur Draftail, l’éditeur ne préservera que le contenu autorisé. Évidemment cela dépend de la configuration de l’éditeur – voici deux exemples. Il peut enlever tous les styles:

![Capture d’écran de l’éditeur avec une démo du copier-coller depuis Word, et enlevant tout le formattage](/docs/user-guide/copy-paste-filter.gif)

Il peut préserver les styles activés dans l’éditeur (gras et italique ici).

![Capture d’écran de l’éditeur avec une démo du copier-coller depuis Word, préservant gras et italique](/docs/user-guide/copy-paste-preserve.gif)

L’éditeur peut ne pas préserver tous les styles à l’identique, mais il filtrera toujours les styles qui ne sont pas activés. Le copier-coller fonctionne bien depuis Google Docs, Dropbox Paper, Word, et plus.

---

## Liens, images, et plus

> :warning: Les liens et images ne sont pas des fonctionnalités par défaut de Draftail – leur fonctionnement peut grandement différer selon la configuration de l’éditeur.

Il est aussi possible d’ajouter des liens dans le text – et gérer les liens avec leur propre tooltip:

![Capture d’écran de l’éditeur avec une démo de liens dans le texte riche](/docs/user-guide/rich-text-link.gif)

Certains éditeurs peuvent aussi contenir des images, si configuré ainsi. Les images sont insérées encadrées de lignes vides (pouvant être enlevées) pour faciliter la sélection de l’image.

![Capture d’écran de l’éditeur avec une démo de bloc image](/docs/user-guide/rich-text-image.gif)

---

Voilà, c’est ça Draftail ! Nous espérons qu’il fonctionnera bien pour vous, et que vous le trouverez utile.

## Feedback

Appréciez-vous ce guide ? Manque-t’il quelque chose ? Nous apprécions tout support, que ce soit rapports de bug, requêtes de fonctionnalités, code, design, revues, tests, documentation, et plus. Prenez un moment pour regarder notre [issue tracker](https://github.com/springload/draftail/issues), et potentiellement commenter ou suggérer des améliorations.

---

## Raccourcis clavier

| Fonction                                        | Raccourci             | Raccourci (macOS)     | Markdown |
| ----------------------------------------------- | --------------------- | --------------------- | -------- |
| **Actions de base**                             |                       |                       |          |
| Copier                                          | `Ctrl + C`            | `⌘ + C`               |          |
| Couper                                          | `Ctrl + X`            | `⌘ + X`               |          |
| Coller                                          | `Ctrl + V`            | `⌘ + V`               |          |
| Coller sans formattage                          | `Ctrl + ⇧ + V`        | `⌘ + ⇧ + V`           |          |
| Défaire                                         | `Ctrl + Z`            | `⌘ + Z`               |          |
| Refaire                                         | `Ctrl + ⇧ + Z`        | `⌘ + ⇧ + Z`           |          |
| Insérer ou éditer un lien                       | `Ctrl + K`            | `⌘ + K`               |          |
| Ouvrir un lien                                  | `Alt + ↵`             | `⌥ + ↵`               |          |
| Insérer une règle horizontale                   |                       |                       | `---`    |
| **Styles de texte (si actif)**                  |                       |                       |          |
| Gras                                            | `Ctrl + B`            | `⌘ + B`               |          |
| Italique                                        | `Ctrl + I`            | `⌘ + I`               |          |
| Sousligné                                       | `Ctrl + U`            | `⌘ + U`               |          |
| Chasse fixe (code)                              | `Ctrl + J`            | `⌘ + J`               |          |
| Barré                                           | `Ctrl + ⇧ + X`        | `⌘ + ⇧ + X`           |          |
| Exposant                                        | `Ctrl + .`            | `⌘ + .`               |          |
| Souscrit                                        | `Ctrl + ,`            | `⌘ + ,`               |          |
| **Formattage de bloc (si actif)**               |                       |                       |          |
| Augmenter l’indentation de liste                | `↹`                   | `↹`                   |          |
| Diminuer l’indentation de liste                 | `⇧ + ↹`               | `⇧ + ↹`               |          |
| Appliquer le style de paragraphe normal         | `Ctrl + Alt + 0`      | `⌘ + ⌥ + 0`           | `⌫`      |
| Appliquer un niveau de titre [1-6]              | `Ctrl + Alt + [1-6]`  | `⌘ + ⌥ + [1-6]`       | `##`     |
| Liste numérotée                                 | `Ctrl + ⇧ + 7`        | `⌘ + ⇧ + 7`           | `1.`     |
| Liste à puce                                    | `Ctrl + ⇧ + 8`        | `⌘ + ⇧ + 8`           | `-`      |
| Citation                                        |                       |                       | `>`      |
| Bloc de code                                    |                       |                       | ` ``` `  |
| Aller à la ligne                                | `↵`                   | `↵`                   |          |
| Insérer un saut de ligne                        | `⇧ + ↵`               | `⇧ + ↵`               |          |
| Insérer un saut de ligne                        | `Ctrl + ↵`            | `⌘ + ↵`               |          |
| **Sélection du texte avec le clavier**          |                       |                       |          |
| Sélectionner tout                               | `Ctrl + A`            | `⌘ + A`               |          |
| Étendre la sélection d’un caractère             | `⇧ + ← or →`          | `⇧ + ← or →`          |          |
| Étendre la sélection d’une ligne                | `⇧ + ↑ or ↓`          | `⇧ + ↑ or ↓`          |          |
| Étendre la sélection d’un mot                   | `Alt + ⇧ + ← or →`    | `⌥ + ⇧ + ← or →`      |          |
| Étendre la sélection jusqu’au début de la ligne | `Ctrl + ⇧ + ←`        | `⌘ + ⇧ + ←`           |          |
| Étendre la sélection jusqu’à la fin de la ligne | `Ctrl + ⇧ + →`        | `⌘ + ⇧ + →`           |          |
| Étendre la sélection jusqu’au début du document | `⇧ + ⇱`               | `⇧ + ⇱`               |          |
| Étendre la sélection jusqu’à la fin du document | `⇧ + ⇲`               | `⇧ + ⇲`               |          |
| **Sélection du texte à la souris**              |                       |                       |          |
| Sélectionner un mot                             | `Double-click`        | `Double-click`        |          |
| Étendre la sélection un mot à la fois           | `Double-click + Drag` | `Double-click + Drag` |          |
| Sélectionner un paragraphe                      | `Triple-click`        | `Triple-click`        |          |
| Étendre la sélection un paragraphe à la fois    | `Triple-click + Drag` | `Triple-click + Drag` |          |
