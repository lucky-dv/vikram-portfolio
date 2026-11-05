import Image from "@tiptap/extension-image";

/** Image node with size + alignment, stored as data-* attributes so they survive sanitising. */
export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      size: {
        default: "full",
        parseHTML: (el) => el.getAttribute("data-size") ?? "full",
        renderHTML: (attrs) => ({ "data-size": attrs.size }),
      },
      align: {
        default: "center",
        parseHTML: (el) => el.getAttribute("data-align") ?? "center",
        renderHTML: (attrs) => ({ "data-align": attrs.align }),
      },
    };
  },
});
