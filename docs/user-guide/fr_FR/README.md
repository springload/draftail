| :earth_africa: Translations                           |
| ----------------------------------------------------- |
| [:gb: English](/docs/user-guide/README.md)            |
| **[:fr: Français](/docs/user-guide/fr_FR/README.md)** |

# Guide utilisateur Draftail

Draftail est un éditeur prévu pour toutes sortes de sites et d’apps. Il vise une expérience utilisateur centrée sur l’usage du clavier, sans besoin d’utiliser la souris. La plupart des styles de texte peuvent être appliqués avec des raccourcis claviers standard, inspirés par [Google Docs](https://support.google.com/docs/answer/179738) et [Markdown](https://fr.wikipedia.org/wiki/Markdown).

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

Ce contrôle H3 utilise un raccourci similaire au [Markdown](https://en.wikipedia.org/wiki/Markdown) `###`. Vous pouvez activer le style de text H3 en tapant `###` suivi d’un espace au début d’une ligne:

![Capture d’écran de l’éditeur montrant les raccourcis basiques pour formattages dans le text et par bloc](/docs/user-guide/keyboard-shortcuts.gif)

Et biensûr, les raccourcis habituels pour des contrôles communs comme gras, undo/redo sont aussi disponibles. Voici un autre exemple de raccourci, `-` ou `*` pour listes à puce:

![Capture d’écran de l’éditeur avec raccourcis pour appliquer les listes à puce, et indenté/dé-indenter ou arrêter la liste](/docs/user-guide/list-item-shortcuts.gif)

Si les listes numérotées étaient disponibles dans cet éditeur, vous pourriez aussi utiliser `1.`. Dans l’éditeur ci-dessous, nous avons aussi activé les sauts de ligne et règles horizontales, qui ont aussi leur propre bouton et raccourci:

![Capture d’écran de l’éditeur montrant le support pour les sauts de lignes et règles horiontales avec les raccourcis correspondants](/docs/user-guide/line-breaks-horizontal-rules.gif)

Si vous oubliez le raccourci pour un contrôle donné, il sera dans la tooltip à moins qu’il n’y en ait pas de défini.

![Capture d’écran de l’éditeur avec une démo des boutons undo/redo et raccourcis clavier](/docs/user-guide/undo-redo.gif)

Ces raccourcis sont vraiment pratiques sur écrans tactiles, où il peut être difficile d’aller et venir entre la saisie de texte et la barre d’outils. Vous pouvez trouver la [liste complète des raccourcis supportés](#keyboard-shortcuts) ci-dessous, qui seront disponibles à condition que le contrôle correspondant soit activé dans l’éditeur.

---

### Copier-coller du contenu dans l’éditeur

En collant du contenu dans un éditeur Draftail, l’éditeur va enlever tous les styles de texte qui ne sont pas autorisés. Évidemment cela dépend de la configuration de l’éditeur – il peut enlever tout formattage:

![Capture d’écran de l’éditeur avec une démo du copier-coller depuis Word, et enlevant tout le formattage](/docs/user-guide/copy-paste-filter.gif)

Ou bien il peut préserver les styles activés dans l’éditeur (gras et italique ici).

![Capture d’écran de l’éditeur avec une démo du copier-coller depuis Word, préservant gras et italique](/docs/user-guide/copy-paste-preserve.gif)

L’éditeur peut ne pas préserver tous les styles à l’identique, mais il filtrera toujours les styles qui ne sont pas activés. Le copier-coller fonctionne bien depuis Google Docs, Dropbox Paper, Word, et plus.

---

## Liens, images, et plus

> :warning: Les liens et images ne sont pas des fonctionnalités par défaut de Draftail – leur fonctionnement peut grandement différer selon la configuration de l’éditeur.

Il est aussi possible d’ajouter des liens dans le text – et gérer les liens avec leur propre tooltip:

![Capture d’écran de l’éditeur avec une démo de liens dans le texte riche](/docs/user-guide/rich-text-link.gif)

Certains éditeurs peuvent aussi contenir des images, si configuré ainsi. Les images occupent toujours un bloc entier, inséré encadré de lignes vides (pouvant être enlevées) pour faciliter la sélection de l’image.

![Capture d’écran de l’éditeur avec une démo de bloc image](/docs/user-guide/rich-text-image.gif)

---

Voilà, c’est ça Draftail ! Nous espérons qu’il fonctionnera bien pour vous, et que vous le trouverez utile.

## Feedback

Appréciez-vous ce guide ? Manque-t’il quelque chose ? Nous apprécions tout support, que ce soit rapports de bug, requêtes de fonctionnalités, code, design, revues, tests, documentation, et plus. Prenez un moment pour regarder notre [issue tracker](https://github.com/springload/draftail/issues), et potentiellement commenter ou suggérer des améliorations.

---

## Raccourcis clavier

| Fonction                                          | Raccourci             | Raccourci (macOS)     | Alternative |
| ------------------------------------------------- | --------------------- | --------------------- | ----------- |
| **Common actions**                                |                       |                       |             |
| Copy                                              | `Ctrl + C`            | `⌘ + C`               |             |
| Cut                                               | `Ctrl + X`            | `⌘ + X`               |             |
| Paste                                             | `Ctrl + V`            | `⌘ + V`               |             |
| Paste without formatting                          | `Ctrl + ⇧ + V`        | `⌘ + ⇧ + V`           |             |
| Undo                                              | `Ctrl + Z`            | `⌘ + Z`               |             |
| Redo                                              | `Ctrl + ⇧ + Z`        | `⌘ + ⇧ + Z`           |             |
| Insert or edit link                               | `Ctrl + K`            | `⌘ + K`               |             |
| Open link                                         | `Alt + ↵`             | `⌥ + ↵`               |             |
| Insert horizontal rule                            |                       |                       | `---`       |
| **Text formatting (if enabled)**                  |                       |                       |             |
| Bold                                              | `Ctrl + B`            | `⌘ + B`               |             |
| Italic                                            | `Ctrl + I`            | `⌘ + I`               |             |
| Underline                                         | `Ctrl + U`            | `⌘ + U`               |             |
| Monospace (code)                                  | `Ctrl + J`            | `⌘ + J`               |             |
| Strikethrough                                     | `Ctrl + ⇧ + X`        | `⌘ + ⇧ + X`           |             |
| Superscript                                       | `Ctrl + .`            | `⌘ + .`               |             |
| Subscript                                         | `Ctrl + ,`            | `⌘ + ,`               |             |
| **Paragraph formatting (if enabled)**             |                       |                       |             |
| Increase list indentation                         | `↹`                   | `↹`                   |             |
| Decrease list indentation                         | `⇧ + ↹`               | `⇧ + ↹`               |             |
| Apply normal text style                           | `Ctrl + Alt + 0`      | `⌘ + ⌥ + 0`           | `⌫`         |
| Apply heading style [1-6]                         | `Ctrl + Alt + [1-6]`  | `⌘ + ⌥ + [1-6]`       | `##`        |
| Numbered list                                     | `Ctrl + ⇧ + 7`        | `⌘ + ⇧ + 7`           | `1.`        |
| Bulleted list                                     | `Ctrl + ⇧ + 8`        | `⌘ + ⇧ + 8`           | `-`         |
| Blockquote                                        |                       |                       | `>`         |
| Code block                                        |                       |                       | ` ``` `     |
| Go to new line                                    | `↵`                   | `↵`                   |             |
| Insert soft new line                              | `⇧ + ↵`               | `⇧ + ↵`               |             |
| Insert soft new line                              | `Ctrl + ↵`            | `⌘ + ↵`               |             |
| **Text selection with keyboard**                  |                       |                       |             |
| Select all                                        | `Ctrl + A`            | `⌘ + A`               |             |
| Extend selection one character                    | `⇧ + ← or →`          | `⇧ + ← or →`          |             |
| Extend selection one line                         | `⇧ + ↑ or ↓`          | `⇧ + ↑ or ↓`          |             |
| Extend selection one word                         | `Alt + ⇧ + ← or →`    | `⌥ + ⇧ + ← or →`      |             |
| Extend selection to the beginning of the line     | `Ctrl + ⇧ + ←`        | `⌘ + ⇧ + ←`           |             |
| Extend selection to the end of the line           | `Ctrl + ⇧ + →`        | `⌘ + ⇧ + →`           |             |
| Extend selection to the beginning of the document | `⇧ + ⇱`               | `⇧ + ⇱`               |             |
| Extend selection to the end of the document       | `⇧ + ⇲`               | `⇧ + ⇲`               |             |
| **Text selection with mouse**                     |                       |                       |             |
| Select word                                       | `Double-click`        | `Double-click`        |             |
| Extend selection one word at a time               | `Double-click + Drag` | `Double-click + Drag` |             |
| Select paragraph                                  | `Triple-click`        | `Triple-click`        |             |
| Extend selection one paragraph at a time          | `Triple-click + Drag` | `Triple-click + Drag` |             |
