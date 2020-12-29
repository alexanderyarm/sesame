import { useCallback, useState } from "react";
import { Autocomplete } from "../../shared/components/Autocomplete/Autocomplete";
import { AutocompleteItemComponentProps } from "../../shared/components/Autocomplete/types/Autocomplete.types";
import "./ProductAutocomplete.css";

import { PRODUCTS } from "./products";

type ProductAutocompleteItem = string | null;

export const ProductAutocomplete = () => {
  const [inputValue, setInputValue] = useState<ProductAutocompleteItem>(null);

  const onAutocompleteValueChange = useCallback(
    (selectedValue: ProductAutocompleteItem) => {
      setInputValue(selectedValue);
    },
    [setInputValue]
  );

  const filterPredicate = useCallback(
    (item: ProductAutocompleteItem, searchString: string) => {
      if (item) {
        return item.toLowerCase().includes(searchString.toLowerCase());
      }

      return false;
    },
    []
  );

  const keyField = useCallback(
    (item: ProductAutocompleteItem) => (item ? item : ""),
    []
  );

  const itemToDisplayString = useCallback(
    (item: ProductAutocompleteItem) => (item ? item : ""),
    []
  );

  const ItemComponent = ({
    item,
    isSelected,
    isHovered,
    searchString,
  }: AutocompleteItemComponentProps<string>) => {
    const itemClassNames = [
      "ProductAutocomplete_item",
      isSelected ? "m_selected" : "",
      isHovered ? "m_hovered" : "",
    ].join(" ");

    const regExp = new RegExp(searchString, "ig");

    return (
      <div
        className={itemClassNames}
        dangerouslySetInnerHTML={{
          __html: item.replace(regExp, (match) => {
            return `<span>${match}</span>`;
          }),
        }}
      />
    );
  };

  return (
    <div className="ProductAutocomplete">
      <Autocomplete
        value={inputValue}
        items={PRODUCTS}
        filterPredicate={filterPredicate}
        keyField={keyField}
        ItemComponent={ItemComponent}
        itemToDisplayString={itemToDisplayString}
        onChange={onAutocompleteValueChange}
        placeholder="Start typing here..."
      />

      <div className="ProductAutocomplete_value_container">
        Selected value:{" "}
        <span className="ProductAutocomplete_value">
          {inputValue ? inputValue : "null"}
        </span>
      </div>
    </div>
  );
};
