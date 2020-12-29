export type AutocompleteItemComponentProps<Item> = {
  item: Item;
  isHovered?: boolean;
  isSelected?: boolean;
  searchString: string;
};

export type AutocompleteProps<Item> = {
  // static items list to search from
  items: Item[];
  // predicate to filter items by search string
  filterPredicate: (item: Item, searchString: string) => boolean;
  // controlled value, can be empty
  value: Item | null;
  // // calback to execute when user selects one of the items in the list
  onChange: (item: Item | null) => void;
  // component to render item in the list
  ItemComponent: (props: AutocompleteItemComponentProps<Item>) => JSX.Element;
  // the field to use in the render items loop as key
  keyField: (item: Item) => string;
  // get string representation of item. e.g. for the input
  itemToDisplayString: (item: Item) => string;
  // displayed in the input when value is empty
  placeholder?: string;
  // name attribute value of the input
  name?: string;
};
