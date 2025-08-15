import { ICreateItem } from "./ICreateItem";

interface ICreateItemWithUserId extends ICreateItem {
  user_id: string;
}
