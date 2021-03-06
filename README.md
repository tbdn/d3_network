# Visualization of Network Data

## Project Members
- <Member1>
- <Member2>
- Source of Data: TCPDUMP - Lecture "<Lecturename>"
- Source of Code: jQuery UI for the Slider, annotated inside of the code http://jqueryui.com/slider/#range

## Used Frameworks
- D3 Version 3.5.5 https://github.com/d3/d3/releases/tag/v3.5.5
- jQuery Version 3.3.1 https://code.jquery.com/jquery-3.3.1.min.js
- jQuery UI Version 1.12.1 https://jqueryui.com/resources/download/jquery-ui-1.12.1.zip

> Used D3 to visualize information

> Used jQuery and jQuery UI for the Range-Slider-Functionality

## Usage
### Optional Preprocessing
- Export packets from Wireshark as JSON
- Run the java program Main with the path to the json dump as a parameter
  - Optional second parameter: Limit the amount of contained links
- Retrieve preprocessed dump from the "out" folder

### General Usage
- Launch a Webserver inside the root folder at Port 80 or Port 8080
- Open the file "ip_network.html" inside the layout folder to open the webapp in your favourite Browser (>IE10)

### Option Usage
- Check or uncheck the checkboxes at the right side to enable or disable filter options
- Use the range slider at the bottom of the page to set Time-Ranges of the connections that are displayed
- Hover over the Nodes to get additional information about the clients
- Hover over the edges to get additional information about the connections
- Press the button "Show local Nodes" to highlight the local nodes
- Press the button "Toggle node names" to toggle the node names

## Techniques
- Force-Directed Graph
  - Structure or a tree
- Coloring the Nodes by type
  - Local or not Local Addresses
- Connecting the nodes via edges
  - enable or disable the edges to get more information
- Move the nodes to get a better view of the whole situation
- Time and type filters for connections (Dynamic)
