# react-d3-chart

## Getting Started

Install `react-d3-chart` using npm or yarn.

`yarn add d3-react-chart`

`npm install d3-react-chart --save`

## Storybook

React components can be viewed in storybook [here](https://googleinterns.github.io/react-d3-chart)

## Components

### Axis

Provides a basic renderable axis whose location can be specified between `left`, `right`, `top` and `bottom`.

#### Left Axis

![left-axis](https://user-images.githubusercontent.com/22064715/90519538-272d8680-e136-11ea-8c28-ffb15f94563f.png)

#### Bottom Axis

![bottom-axis](https://user-images.githubusercontent.com/22064715/90519601-40363780-e136-11ea-9a96-75fe9bf6ed3a.png)

### Line

Creates a d3 line from the given coordinate points. Color can be set by passing a string hex value.

![line](https://user-images.githubusercontent.com/22064715/90520507-6c9e8380-e137-11ea-8ad9-c56b413a3239.png)

### LineContainer

Renders a group of lines.

![line-container](https://user-images.githubusercontent.com/22064715/90520790-cc952a00-e137-11ea-8809-792427905765.png)

### Context

Provides an overivew of the graph contents and allows brushing to select a sub domain.

![context](https://user-images.githubusercontent.com/22064715/90519817-89868700-e136-11ea-9bd2-62be3e1bab25.png)

![context-gif](https://user-images.githubusercontent.com/22064715/90520034-d0747c80-e136-11ea-90e5-c6736602bc21.gif)

### Bisector

Attaches a vertical line that will provide the respective y value for each line in the graph for the given mouse position. Used for the cursor's intersection mode.

![bisector](https://user-images.githubusercontent.com/22064715/90520299-2b0dd880-e137-11ea-88a1-7652b350d930.png)

![bisector-gif](https://user-images.githubusercontent.com/22064715/90520235-19c4cc00-e137-11ea-9f4e-25a1f30e0f8a.gif)

### Range Selection

Adds the ability to brush the graph and fire a callback on the domain that was selected.

![range-selection](https://user-images.githubusercontent.com/22064715/90521387-75dc2000-e138-11ea-9fbc-0c47220873eb.png)

![range-selection-gif](https://user-images.githubusercontent.com/22064715/90521588-b5a30780-e138-11ea-974e-6deddf684e15.gif)

### Overlay

Wrapper component that handles render and switching between both cursor selection mode.

### ModeSelectionContainer

Renders buttons that will appropriately change cursor mode between selection and intersection on click.

![ModeSelectionContainer](https://user-images.githubusercontent.com/22064715/90520967-fcdcc880-e137-11ea-88a4-b793e3f22ccf.png)

### LineChart

Wrapper component that houses all of the components and functionalities mentioned above. This component is probably the one you will use and manipulate in your project.

## Documentation

API Documentation can be viewed [here](https://googleinterns.github.io/react-d3-chart/docs)
