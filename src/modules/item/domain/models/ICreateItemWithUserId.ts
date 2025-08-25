import { ICreateItem } from "./ICreateItem";

interface ICreateItemWithUserId extends ICreateItem {
  userId: string;
}
