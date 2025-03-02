import { render, screen } from "@testing-library/react";
import RecentMeals from "../RecentMeals";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock next/image
/* eslint-disable @next/next/no-img-element */
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => (
    <img
      {...props}
      alt={props.alt || ""}
      data-testid="next-image"
      style={{
        ...(props.fill
          ? {
              position: "absolute",
              height: "100%",
              width: "100%",
              objectFit: props.objectFit || "cover",
            }
          : {}),
        ...props.style,
      }}
    />
  ),
}));
/* eslint-enable @next/next/no-img-element */

describe("RecentMeals", () => {
  it("renders the component title", () => {
    render(<RecentMeals />);
    expect(screen.getByText("Recent Meals")).toBeInTheDocument();
  });

  it('renders "View All Meals" link', () => {
    render(<RecentMeals />);
    const link = screen.getByText(/View All Meals/);
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/dashboard/meals");
  });

  it("displays empty state when no meals are provided", () => {
    render(<RecentMeals meals={[]} />);
    expect(screen.getByText(/No meals logged yet today/)).toBeInTheDocument();
  });

  it("renders meals when provided", () => {
    const mockMeals = [
      {
        id: "1",
        name: "Grilled Chicken Salad",
        calories: 350,
        protein: 25,
        carbs: 10,
        fat: 15,
        time: "17:30:00",
        imageUrl: "test-image.jpg",
      },
    ];

    render(<RecentMeals meals={mockMeals} />);
    expect(screen.getByText("Grilled Chicken Salad")).toBeInTheDocument();
    expect(screen.getByText("350 kcal")).toBeInTheDocument();
  });

  it("renders edit and delete buttons for each meal", () => {
    const mockMeals = [
      {
        id: "1",
        name: "Grilled Chicken Salad",
        calories: 350,
        protein: 25,
        carbs: 10,
        fat: 15,
        time: "17:30:00",
        imageUrl: "test-image.jpg",
      },
    ];

    render(<RecentMeals meals={mockMeals} />);
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });
});
