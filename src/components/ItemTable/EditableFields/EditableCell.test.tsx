import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EditableCell } from "./EditableCell";
import { updateItem } from "../../../api/itemsApi";
import { expect, vi, describe, test } from "vitest";

vi.mock("../../../api/itemsApi", () => ({
  updateItem: vi.fn().mockResolvedValue({ id: 1, name: "Updated Name" }),
}));

describe("EditableCell", () => {
  const renderProps = {
    initialValue: "Test Value",
    itemId: 1,
    fieldName: "name" as const,
    width: "100px",
    render: (
      value: string,
      isEditing: boolean,
      onSubmit: (value: string) => void,
      onCancel: () => void
    ) => {
      if (isEditing) {
        return (
          <div>
            <input
              data-testid="edit-input"
              value={value}
              onChange={(e) => e.target.value}
            />
            <button
              data-testid="submit-btn"
              onClick={() => onSubmit("New Value")}
            >
              Submit
            </button>
            <button data-testid="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        );
      }
      return <div data-testid="display-value">{value}</div>;
    },
    onUpdateSuccess: vi.fn(),
  };

  test("should display initial value", () => {
    render(<EditableCell {...renderProps} />);
    expect(screen.getByTestId("display-value")).toHaveTextContent("Test Value");
  });

  test("should enter edit mode on click", async () => {
    render(<EditableCell {...renderProps} />);

    fireEvent.click(screen.getByTestId("display-value"));

    expect(screen.getByTestId("edit-input")).toBeInTheDocument();
  });

  test("should submit edited value", async () => {
    render(<EditableCell {...renderProps} />);

    fireEvent.click(screen.getByTestId("display-value"));

    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(updateItem).toHaveBeenCalledWith({
        id: 1,
        data: { name: "New Value" },
      });
    });

    await waitFor(() => {
      expect(renderProps.onUpdateSuccess).toHaveBeenCalled();
    });
  });
});
