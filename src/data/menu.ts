import type { BookPage, MenuChapter } from "@/types/menu";
import { images } from "./images";

/** Structure, prices and photos. Names and descriptions: src/i18n/dictionaries. */
export const menuChapters: MenuChapter[] = [
  {
    id: "sushi",
    numeral: "I",
    jp: "鮨",
    cover: images.tunaTrio,
    items: [
      { id: "otoro", jp: "大とろ", price: "$14", image: images.nigiriAkami },
      { id: "akami", jp: "赤身漬け", price: "$9", image: images.maguroPlate },
      { id: "uni", jp: "雲丹", price: "$16", image: images.sashimiBoat },
      { id: "sake-aburi", jp: "鮭炙り", price: "$10", image: images.sushiPlatter },
      { id: "moriawase", jp: "おまかせ", price: "$62", image: images.counterSet },
    ],
  },
  {
    id: "mains",
    numeral: "II",
    jp: "主菜",
    cover: images.wagyu,
    items: [
      { id: "wagyu", jp: "和牛炭火", price: "$68", image: images.wagyu },
      { id: "gindara", jp: "銀鱈西京焼", price: "$38", image: images.chopsticksFish },
      { id: "hassun", jp: "八寸", price: "$54", image: images.kaisekiSpread },
      { id: "funamori", jp: "舟盛り", price: "$46", image: images.sashimiPlating },
      { id: "chawanmushi", jp: "茶碗蒸し", price: "$16", image: images.omakaseSpread },
    ],
  },
  {
    id: "drinks",
    numeral: "III",
    jp: "飲物",
    cover: images.sakeCups,
    items: [
      { id: "dassai", jp: "獺祭", price: "$24", image: images.sake },
      { id: "kubota", jp: "久保田萬寿", price: "$28", image: images.sakeCups },
      { id: "highball", jp: "柚子紫蘇", price: "$19", image: images.counterSet },
      { id: "umeshu", jp: "梅酒", price: "$15", image: images.sake },
      { id: "gyokuro", jp: "玉露", price: "$9", image: images.greenTea },
    ],
  },
  {
    id: "wine",
    numeral: "IV",
    jp: "葡萄酒",
    cover: images.champagne,
    items: [
      { id: "chablis", jp: "シャブリ", price: "$26", image: images.winePour },
      { id: "koshu", jp: "甲州", price: "$18", image: images.wine },
      { id: "krug", jp: "クリュッグ", price: "$64", image: images.champagne },
      { id: "pinot", jp: "ピノ・ノワール", price: "$22", image: images.winePour },
      { id: "sommelier", jp: "ペアリング", price: "$120", image: images.wine },
    ],
  },
  {
    id: "desserts",
    numeral: "V",
    jp: "甘味",
    cover: images.wagashi,
    items: [
      { id: "tiramisu", jp: "抹茶ティラミス", price: "$14", image: images.matchaCakes },
      { id: "daifuku", jp: "苺大福", price: "$11", image: images.wagashi },
      { id: "sorbet", jp: "柚子シャーベット", price: "$10", image: images.matchaDessert },
      { id: "pannacotta", jp: "黒蜜", price: "$12", image: images.matchaDessert },
      { id: "wagashi", jp: "和菓子", price: "$18", image: images.wagashi },
    ],
  },
];

/**
 * Reading order of the 16 square pages. On desktop they are paired into
 * leaves (front = right page, back = left page); on mobile each page is a leaf.
 */
export const bookPages: BookPage[] = [
  { id: "cover", content: { kind: "cover" } },
  { id: "welcome", content: { kind: "welcome" }, folio: 1 },
  { id: "contents", content: { kind: "contents" }, folio: 2 },
  ...menuChapters.flatMap<BookPage>((chapter, i) => [
    { id: `${chapter.id}-chapter`, content: { kind: "chapter", chapter }, folio: 3 + i * 2 },
    { id: `${chapter.id}-items`, content: { kind: "items", chapter }, folio: 4 + i * 2 },
  ]),
  { id: "pairing", content: { kind: "pairing" }, folio: 13 },
  { id: "reserve", content: { kind: "reserve" }, folio: 14 },
  { id: "back-cover", content: { kind: "back-cover" } },
];

/** Page index (in reading order) where each chapter starts. */
export const chapterPageIndex = Object.fromEntries(
  bookPages.flatMap((page, index) =>
    page.content.kind === "chapter" ? [[page.content.chapter.id, index]] : [],
  ),
) as Record<MenuChapter["id"], number>;
