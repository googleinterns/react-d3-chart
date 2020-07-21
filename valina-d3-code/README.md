## Project description
Design a react-d3-line-chart library that has both stacked and overlapped mode

## Vanila D3 code reference
In `index.html`, you can change params in line 20-22. Ranges means which lines in the rawData we want to display. viewMode should be either `stacked` or `overlapped`. downSampling means every x point is skipped.

## Feature request

These features are not implemented in the vanila code but we'd like to have:

### Automatic downSampling
Have a default downSampling attribute. For example, if there are 1000000 sample points, it makes sense to skip every 50th (display 1, 50, 100, etc points) because we don't need to see much details. We just needed to know the general trend. As users zoom in, the downSampling should automatically descrease (vice versa) based on the domain of xAxis value.

### Range selection and highlight
Right now the default brush behavior is moving the graph (if zoomed). Have an option (button) to change the brush behavior for range selection too. When the user selects a range, the background should be highlited. A legend should show the information of selected ranges (x0-x1 value). After brush, users should also be able to pass in a handler(callback) to handle the ranges selected.

## Convert to react component
Ideally users should use it like this:


```
const data = {
    "line1": [{x:0, y:1}, {x:1, y:2}, ...],
    "line2": [{x:0, y:-1}, {x:1, y:3}, ...],
    ...
}


<D3LineChart
  dataSource={data}
  xDomain={[0, 100000]} //optional, if not specifed, autoscale
  yDomain={[-500, 500]} //optional, if not specifed, autoscale
  viewMode="stacked" // or overlapped
  downSampling={5}
  autoDownSAmpling={ture} // see Feature Request Automatic downSampling
  width={500} // width of this component, if not specified, autofit
  height={500} // height of this compoennt, if not specified, autofit
>
```

Open to other appropriate designs as well.

## Reference

I found this to be a good starting point:
https://wattenberger.com/blog/react-and-d3