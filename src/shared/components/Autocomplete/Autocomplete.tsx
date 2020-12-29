import React, {
  ChangeEvent,
  KeyboardEvent,
  useState,
  useCallback,
  FocusEvent,
  useEffect,
} from "react";
import { AutocompleteProps } from "./types/Autocomplete.types";
import "./Autocomplete.css";
import { useClickOutsideElement } from "../Autocomplete/hooks/clickOutsideElement";

export const Autocomplete: <Item>(
  props: AutocompleteProps<Item>
) => React.ReactElement<AutocompleteProps<Item>> = (props) => {
  const {
    value,
    items,
    itemToDisplayString,
    keyField,
    filterPredicate,
    ItemComponent,
    onChange,
    name,
    placeholder,
  } = props;
  const [displayValue, setDisplayValue] = useState("");
  const [previewValue, setPreviewValue] = useState<string | null>("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const filteredItems = items.filter((item) =>
    filterPredicate(item, displayValue)
  );
  const autocompleteRef = useClickOutsideElement(() => {
    setIsOpen(false);
  });

  const openDropdown = useCallback(() => {
    setActiveIndex(0);
    setIsOpen(true);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onSelect = useCallback(
    (selectedItem: any, compareByString = false) => {
      const selectedItemString = compareByString
        ? selectedItem
        : itemToDisplayString(selectedItem);
      const existedItem = items.find(
        (item) =>
          itemToDisplayString(item).toLowerCase() ===
          selectedItemString.toLocaleLowerCase()
      );

      // we are checking existance of selected/typed item
      // in the list of items.
      // if it doesn't exist we return null as a value
      if (existedItem) {
        setDisplayValue(itemToDisplayString(existedItem));
        onChange(existedItem);
      } else {
        setDisplayValue("");
        onChange(null);
      }

      closeDropdown();
    },
    [items, itemToDisplayString, setDisplayValue, onChange, closeDropdown]
  );

  const onFocusHandler = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      e.stopPropagation();
      openDropdown();
    },
    [openDropdown]
  );

  // EVENT HANDLERS
  const onChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      openDropdown();
      setPreviewValue(null);
      setDisplayValue(e.target.value);
    },
    [openDropdown]
  );

  const onKeyDownHandler = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const { key } = e;
      const itemsLength = filteredItems.length;

      if (isOpen) {
        switch (key) {
          case "Tab": {
            onSelect(displayValue, true);
            break;
          }
          case "Enter": {
            onSelect(filteredItems[activeIndex]);
            break;
          }
          case "ArrowUp": {
            if (activeIndex > 0) {
              setActiveIndex(activeIndex - 1);
            }
            break;
          }
          case "ArrowDown": {
            if (activeIndex < itemsLength - 1) {
              setActiveIndex(activeIndex + 1);
            }
            break;
          }
          case "Escape": {
            closeDropdown();
            break;
          }
          default:
            break;
        }
      } else {
        if (key === "ArrowDown") {
          openDropdown();
        }
      }
    },
    [
      activeIndex,
      openDropdown,
      closeDropdown,
      displayValue,
      filteredItems,
      isOpen,
      onSelect,
    ]
  );

  const listItemOnClickHandler = useCallback(
    (item) => () => {
      onSelect(item);
    },
    [onSelect]
  );

  // we want to value in the input while hovering list items
  // but not applying until we click or press Enter button
  const listItemOnMouseEnterHandler = useCallback(
    (item, index) => () => {
      setPreviewValue(itemToDisplayString(item));
      setActiveIndex(index);
    },
    [itemToDisplayString]
  );

  // return input value to the current active state
  const listItemOnMouseLeaveHandler = useCallback(() => {
    setPreviewValue(null);
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      // in case when input lost focus and user typed value which equals
      // to on of the values in the list we want to select it
      onSelect(displayValue, true);
    }
  }, [isOpen, onSelect, displayValue]);

  const listClassNames = ["Autocomplete_list", isOpen ? "m_opened" : ""].join(
    " "
  );

  return (
    <div className="Autocomplete" ref={autocompleteRef}>
      <input
        type="text"
        className="Autocomplete_input"
        value={previewValue ? previewValue : displayValue}
        onFocus={onFocusHandler}
        onChange={onChangeHandler}
        onKeyDown={onKeyDownHandler}
        placeholder={placeholder}
        name={name}
      />

      {Boolean(filteredItems.length) && (
        <div className={listClassNames} role="list">
          {filteredItems.map((item, index) => (
            <div
              role="listitem"
              key={keyField(item)}
              className="Autocomplete_list_item"
              onClick={listItemOnClickHandler(item)}
              onMouseEnter={listItemOnMouseEnterHandler(item, index)}
              onMouseLeave={listItemOnMouseLeaveHandler}
            >
              <ItemComponent
                item={item}
                searchString={displayValue}
                isHovered={activeIndex === index}
                isSelected={item === value}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
