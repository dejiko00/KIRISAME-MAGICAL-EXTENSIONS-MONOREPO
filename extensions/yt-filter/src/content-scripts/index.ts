import { utils } from "../utils/common";
import { ExtensionSelectError } from "../utils/error";
import { onInject } from "./inject";

async function _main() {
  await onInject();
  observeChanges();
}

const observeChanges = () => {
  const $elGridRenderer = document.querySelector("ytd-rich-grid-renderer");
  if (!$elGridRenderer) {
    throw new ExtensionSelectError("GRID");
  }

  utils.debug("Grid_Renderer", $elGridRenderer);

  const $elGridItemRenderer = $elGridRenderer.querySelectorAll("#contents > *");
  if ($elGridItemRenderer.length === 0) {
    throw new ExtensionSelectError("ITEM");
  }

  utils.debug("Grid_Item_Renderer", $elGridItemRenderer);
  //   const gridMut$ = new MutationObserver((mutations, observer) => {
  //     utils.debug("Grid_Mutation", mutations);
  //     for (const mutation of mutations) {
  //       utils.debug("Grid_Mutation", mutation);
  //     }
  //   });

  //   gridMut$.observe($elGridRenderer, {
  //     characterData: true,
  //   });
};

_main();
