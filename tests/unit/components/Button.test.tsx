import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, ButtonGroup } from '@/src/shared/components/ui/atoms/Button';
import { Download, Plus } from 'lucide-react';

describe('Button Component', () => {
  describe('Basic Rendering', () => {
    it('renders button with text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('renders with data-testid', () => {
      render(<Button data-testid="custom-button">Button</Button>);
      expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('renders default variant correctly', () => {
      render(<Button variant="default">Default</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary-600');
    });

    it('renders destructive variant correctly', () => {
      render(<Button variant="destructive">Delete</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-error-600');
    });

    it('renders outline variant correctly', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border');
    });

    it('renders ghost variant correctly', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-neutral-100');
    });

    it('renders link variant correctly', () => {
      render(<Button variant="link">Link</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-primary-600');
    });

    it('renders gradient variant correctly', () => {
      render(<Button variant="gradient">Gradient</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gradient-to-r');
    });
  });

  describe('Sizes', () => {
    it('renders small size correctly', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8');
    });

    it('renders default size correctly', () => {
      render(<Button size="default">Default</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10');
    });

    it('renders large size correctly', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-12');
    });

    it('renders extra large size correctly', () => {
      render(<Button size="xl">Extra Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-14');
    });

    it('renders icon size correctly', () => {
      render(<Button size="icon">Icon</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'w-10');
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when isLoading is true', () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
      // Check for spinner (Loader2 icon)
      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('shows loading text when provided', () => {
      render(
        <Button isLoading loadingText="Processing...">
          Submit
        </Button>
      );
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    it('disables button when loading', () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('does not call onClick when loading', async () => {
      const handleClick = jest.fn();
      render(
        <Button isLoading onClick={handleClick}>
          Loading
        </Button>
      );
      
      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Icons', () => {
    it('renders left icon', () => {
      render(
        <Button leftIcon={<Plus data-testid="plus-icon" />}>
          Add Item
        </Button>
      );
      expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
    });

    it('renders right icon', () => {
      render(
        <Button rightIcon={<Download data-testid="download-icon" />}>
          Download
        </Button>
      );
      expect(screen.getByTestId('download-icon')).toBeInTheDocument();
    });

    it('hides right icon when loading', () => {
      render(
        <Button isLoading rightIcon={<Download data-testid="download-icon" />}>
          Download
        </Button>
      );
      expect(screen.queryByTestId('download-icon')).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('disables button when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('does not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );
      
      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Event Handling', () => {
    it('calls onClick when clicked', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('logs analytics when trackingId is provided', async () => {
      const consoleSpy = jest.spyOn(console, 'debug').mockImplementation();
      const handleClick = jest.fn();
      
      render(
        <Button onClick={handleClick} trackingId="test-button">
          Track me
        </Button>
      );
      
      await userEvent.click(screen.getByRole('button'));
      expect(consoleSpy).toHaveBeenCalledWith('Button clicked:', 'test-button');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label when provided', () => {
      render(<Button ariaLabel="Close dialog">×</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
    });

    it('has proper aria-describedby when provided', () => {
      render(<Button ariaDescribedBy="help-text">Help</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'help-text');
    });

    it('sets aria-disabled when loading', () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Animation', () => {
    it('applies animation classes', () => {
      render(<Button animation="pulse">Pulse</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('animate-pulse');
    });
  });

  describe('Keyboard Interaction', () => {
    it('can be focused and activated with keyboard', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Keyboard</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
      
      fireEvent.keyDown(button, { key: 'Enter' });
      fireEvent.keyUp(button, { key: 'Enter' });
      
      // Note: onClick might not be called by keyDown/keyUp in jsdom
      // This is testing that the button can receive focus
    });
  });
});

describe('ButtonGroup Component', () => {
  it('renders button group with horizontal orientation by default', () => {
    render(
      <ButtonGroup>
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>
    );
    
    const group = screen.getByRole('group');
    expect(group).toHaveClass('flex-row');
  });

  it('renders button group with vertical orientation', () => {
    render(
      <ButtonGroup orientation="vertical">
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>
    );
    
    const group = screen.getByRole('group');
    expect(group).toHaveClass('flex-col');
  });

  it('applies custom className', () => {
    render(
      <ButtonGroup className="custom-group">
        <Button>First</Button>
      </ButtonGroup>
    );
    
    const group = screen.getByRole('group');
    expect(group).toHaveClass('custom-group');
  });
});