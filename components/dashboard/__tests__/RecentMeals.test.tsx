import { render, screen, fireEvent } from '@testing-library/react';
import RecentMeals from '../RecentMeals';

// Mock next/image since it's not available in the test environment
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

describe('RecentMeals Component', () => {
  it('renders the component title', () => {
    render(<RecentMeals />);
    expect(screen.getByText('Recent Meals')).toBeInTheDocument();
  });

  it('renders "View All" link', () => {
    render(<RecentMeals />);
    expect(screen.getByText('View All')).toBeInTheDocument();
    expect(screen.getByText('View All').closest('a')).toHaveAttribute('href', '/dashboard/meals');
  });

  it('displays meal information correctly', () => {
    render(<RecentMeals />);
    
    // Check if the mock meal is displayed
    expect(screen.getByText('Grilled Chicken Salad')).toBeInTheDocument();
    expect(screen.getByText('350 kcal')).toBeInTheDocument();
  });

  it('renders edit and delete buttons for each meal', () => {
    render(<RecentMeals />);
    
    // Since we have one mock meal, we should find one edit and one delete button
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    
    expect(editButtons).toHaveLength(1);
    expect(deleteButtons).toHaveLength(1);
  });

  it('displays empty state message when no meals are present', () => {
    // Mock the meals array to be empty for this test
    jest.spyOn(Array.prototype, 'map').mockImplementationOnce(() => []);
    
    render(<RecentMeals />);
    
    expect(screen.getByText('No meals logged yet today')).toBeInTheDocument();
    expect(screen.getByText('Add Your First Meal')).toBeInTheDocument();
  });

  it('renders meal timestamp in correct format', () => {
    render(<RecentMeals />);
    
    // The mock data has a timestamp of '2024-02-15T12:00:00Z'
    // Note: The actual displayed time will depend on the user's locale
    const timestamp = new Date('2024-02-15T12:00:00Z').toLocaleTimeString();
    expect(screen.getByText(timestamp)).toBeInTheDocument();
  });

  it('renders meal image with fallback', () => {
    render(<RecentMeals />);
    
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('alt', 'Grilled Chicken Salad');
    expect(images[0]).toHaveAttribute('src', expect.stringContaining('IMG_Academy_Logo.svg'));
  });
}); 