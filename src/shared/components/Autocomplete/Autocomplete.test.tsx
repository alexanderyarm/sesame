import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Autocomplete } from "./Autocomplete";

const PRODUCTS = [
  "Akee",
  "Apple",
  "Apricot",
  "Clementine",
  "Purple mangosteen",
  "Loquat",
  "Yuzu",
  "Zucchini",
];

function AutocompleteTest() {
  const [value, setValue] = useState(null);

  const filterPredicate = (item: string, searchString: string) => {
    if (item) {
      return item.toLowerCase().includes(searchString.toLowerCase());
    }

    return false;
  };

  const keyField = (item: string) => (item ? item : "");
  const itemToDisplayString = (item: string) => (item ? item : "");

  const onChange = (selectedValue: string) => {
    setValue(selectedValue);
  };

  const ItemComponent = ({ item }) => {
    return <div>{item}</div>;
  };

  return (
    <React.Fragment>
      <Autocomplete
        items={PRODUCTS}
        value={value}
        filterPredicate={filterPredicate}
        keyField={keyField}
        itemToDisplayString={itemToDisplayString}
        onChange={onChange}
        ItemComponent={ItemComponent}
        name="autocomplete"
        placeholder="Placeholder"
      />

      <div>Result: {value ? value : "null"}</div>
    </React.Fragment>
  );
}

const setup = () => {
  const utils = render(<AutocompleteTest />);
  const input = screen.getByRole("textbox");

  return {
    ...utils,
    input,
  };
};

test("input and result render correctly", () => {
  const { getByText, input } = setup();
  const result = getByText(`Result: null`);

  expect(input).toBeInTheDocument();
  expect(result).toBeInTheDocument();
});

test("placeholder works", () => {
  const { getByPlaceholderText } = setup();
  expect(getByPlaceholderText("Placeholder")).toBeInTheDocument();
});

test("show all list items on focus", () => {
  const { getAllByRole } = setup();
  expect(getAllByRole("listitem").length).toEqual(PRODUCTS.length);
});

test("filter list items correctly", () => {
  const { getAllByRole, input } = setup();
  const selectedItemValue = "a";

  const matchNumber = PRODUCTS.filter((product) =>
    product.toLowerCase().includes(selectedItemValue)
  ).length;

  fireEvent.change(input, {
    target: { value: selectedItemValue },
  });

  expect(getAllByRole("listitem").length).toEqual(matchNumber);
});

test("display nothing when no matched items", () => {
  const { queryAllByRole, input } = setup();
  const selectedItemValue = "nomatch";

  fireEvent.change(input, {
    target: { value: selectedItemValue },
  });

  expect(queryAllByRole("listitem").length).toEqual(0);
});

test("filter list of items and select correctly on mouse click", () => {
  const { getByText, input } = setup();
  const selectedItemValue = "Akee";

  fireEvent.change(input, {
    target: { value: selectedItemValue.substr(0, 2) },
  });
  const filteredListItem = getByText(selectedItemValue);
  expect(filteredListItem).toBeInTheDocument();

  fireEvent.click(filteredListItem);
  const result = getByText(`Result: ${selectedItemValue}`);
  expect(input).toHaveValue(selectedItemValue);
  expect(result).toBeInTheDocument();
});

test("filter list of items and select correctly on Enter", () => {
  const { getByText, input } = setup();
  const selectedItemValue = "Clementine";

  fireEvent.change(input, {
    target: { value: selectedItemValue.substr(0, 2) },
  });
  const filteredListItem = getByText(selectedItemValue);
  expect(filteredListItem).toBeInTheDocument();

  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
  const result = getByText(`Result: ${selectedItemValue}`);
  expect(input).toHaveValue(selectedItemValue);
  expect(result).toBeInTheDocument();
});

test("reset value correctly on Escape press", () => {
  const { getByText, input } = setup();
  const selectedItemValue = "Apple";

  fireEvent.change(input, {
    target: { value: selectedItemValue.substr(0, 2) },
  });
  fireEvent.click(getByText(selectedItemValue));
  fireEvent.change(input, {
    target: { value: selectedItemValue.substr(0, 2) },
  });
  fireEvent.keyDown(input, { key: "Escape", code: "Escape" });
  const result = getByText(`Result: null`);
  expect(result).toBeInTheDocument();
});

test("reset value correctly on Tab press", () => {
  const { getByText, input } = setup();
  const selectedItemValue = "Apricot";

  fireEvent.change(input, {
    target: { value: selectedItemValue.substr(0, 2) },
  });
  fireEvent.click(getByText(selectedItemValue));
  fireEvent.change(input, {
    target: { value: selectedItemValue.substr(0, 2) },
  });
  fireEvent.keyDown(input, { key: "Tab", code: "Tab" });
  const result = getByText(`Result: null`);
  expect(result).toBeInTheDocument();
});

test("set the value if input value equals list item value", () => {
  const { getByText, input } = setup();
  const selectedItemValue = "Purple mangosteen";

  fireEvent.change(input, {
    target: { value: selectedItemValue.toLowerCase() },
  });
  fireEvent.keyDown(input, { key: "Tab", code: "Tab" });

  expect(input).toHaveValue(selectedItemValue);
  expect(getByText(`Result: ${selectedItemValue}`)).toBeInTheDocument();
});

test("display item value in the input on mouse enter and return current value on mouse leave", () => {
  const { getByText, getAllByRole, input } = setup();
  const selectedItemValue = "Yuzu";

  fireEvent.click(getByText(selectedItemValue));
  expect(input).toHaveValue(selectedItemValue);

  fireEvent.change(input, {
    target: { value: "Ap" },
  });
  const listItem = getAllByRole("listitem")[1];
  fireEvent.mouseEnter(listItem);
  expect(input).toHaveValue("Apricot");

  fireEvent.mouseLeave(listItem);
  expect(input).toHaveValue("Ap");
  expect(getByText(`Result: ${selectedItemValue}`)).toBeInTheDocument();
});
