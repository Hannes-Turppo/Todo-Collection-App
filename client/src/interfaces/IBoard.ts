import { IArticle } from "./IArticle";
import { ICollection } from "./ICollection";

export interface IBoard {
  collections: ICollection[],
  articles: IArticle[]
}