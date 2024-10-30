import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Basic from './Basic';

const meta = {
  title: 'Example/Basic Carousel',
  component: Basic,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    totalSlides: {
      control: { type: 'range', min: 1, max: 30 },
    },
    visibleSlides: {
      control: { type: 'range', min: 1, max: 5 },
    },
    infinite: {
      control: 'boolean',
    },
    step: {
      control: { type: 'range', min: 1, max: 5 },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Basic>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    totalSlides: 5,
    visibleSlides: 2,
    infinite: false,
    step: 1,
  },
};
