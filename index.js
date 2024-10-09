/*Overall Pseudocode Explains the functionality of this HTML file:


Constants and API URL:

SANDBOX: A constant string that specifies the sandbox environment for API requests.
API_URL: Constructs the base URL for API requests by appending the SANDBOX variable.
State Management:

events: An array to store event objects fetched from the API.
Asynchronous Functions:

getEvents: Fetches events from the API, updates the events state, and handles errors.
addEvent: Sends a POST request to the API to create a new event and handles errors.
deleteEvent: Sends a DELETE request to remove an event by its ID and handles errors.
Rendering Logic:

renderEvents: Renders the list of events in the DOM. Each event is displayed in a list item, with a delete button that allows removal of the event.
Initialization:

init: Fetches events on application start and renders them.
Form Handling:

An event listener on the form handles the submission, prevents the default behavior, 
and creates a new event object using the form data. It then calls addEvent, fetches the updated event list, and re-renders the events.
Overall Functionality
This JavaScript code defines an event management application that fetches, 
adds, and deletes events using an API. The 
functions handle asynchronous operations, maintain state, and dynamically update the UI 
based on user interactions. The detailed comments explain each section's purpose 
and the logic behind the code, making it easier to understand and maintain.
*/




// Constant representing the specific sandbox environment for the API
const SANDBOX = "2408-Bertha-Wang"; 

// The base URL for accessing the API, constructed using the sandbox constant
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${SANDBOX}/events/`;

// #region State

// Array to hold the events fetched from the API
let events = [];

/** 
 * Fetches events from the API and updates the `events` state.
 * Utilizes the Fetch API to perform an asynchronous GET request.
 */
async function getEvents() {
  try {
    // Sending a GET request to the API_URL to retrieve events
    const response = await fetch(API_URL);

    // Parsing the JSON response to an object
    const responseObj = await response.json();

    // Debugging tip: Inspect the structure of the response object
    // events is updated with the data from the API response
    events = responseObj.data;
  } catch (error) {
    // Log any errors encountered during the fetch process
    console.error(error);
  }
}

/** 
 * Sends a POST request to the API to create a new event.
 * @param {Object} event - The event object containing details to be created.
 */
async function addEvent(event) {
  try {
    // Sending a POST request to the API_URL to add a new event
    const response = await fetch(API_URL, {
      method: "POST", // HTTP method for creating a new resource
      headers: { 
        "Content-Type": "application/json" // Indicating that we are sending JSON data
      },
      // The body contains the event data, converted to a JSON string
      body: JSON.stringify(event),
    });

    // Check if the response is not OK and throw an error with the message from the response
    if (!response.ok) {
      const responseObj = await response.json();
      throw new Error(responseObj.error.message);
    }
  } catch (error) {
    // Log any errors encountered during the post request
    console.error(error);
  }
}

/** 
 * Sends a DELETE request to the API to remove an event by its ID.
 * @param {string} id - The ID of the event to be deleted.
 */
async function deleteEvent(id) {
  try {
    // Sending a DELETE request to the API for the specific event ID
    const response = await fetch(API_URL + id, {
      method: "DELETE", // HTTP method for deleting a resource
    });

    // Check if the response is not OK and throw an error with the message from the response
    if (!response.ok) {
      const responseObj = await response.json();
      throw new Error(responseObj.error.message);
    }
  } catch (error) {
    // Log any errors encountered during the delete request
    console.error(error);
  }
}

// #region Render

/** 
 * Renders the events in the DOM by creating list items for each event.
 */
function renderEvents() {
  // Creating an array of list item elements based on the events in state
  const $events = events.map((event) => {
    const $li = document.createElement("li"); // Creating a new list item element

    // Setting the inner HTML of the list item to display event details
    $li.innerHTML = `
      <h2>${event.name}</h2>
      <p>${event.date}</p>
      <p>${event.location}</p>
      <p>${event.description}</p>
      <button>Delete</button>
    `;

    // Selecting the delete button within the current list item
    const $button = $li.querySelector("button");
    
    // Adding a click event listener to the delete button
    $button.addEventListener("click", async () => {
      await deleteEvent(event.id); // Await the delete operation
      await getEvents(); // Fetch the updated events from the API
      renderEvents(); // Re-render the events list
    });

    return $li; // Return the constructed list item
  });

  // Selecting the unordered list element from the DOM
  const $ul = document.querySelector("ul");
  $ul.replaceChildren(...$events); // Replace the children of the ul with the new events
}

// #region Script

/** 
 * Initializes the application by fetching events and rendering them.
 */
async function init() {
  await getEvents(); // Fetch events from the API
  renderEvents(); // Render the fetched events to the DOM
}

// Calling the init function to start the application
init();

// Adding an event listener to the form to handle submissions
const $form = document.querySelector("form");
$form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent the default form submission behavior

  // Creating a new event object using form input values
  const date = new Date($form.date.value).toISOString(); // Convert date input to ISO string
  const newEvent = {
    name: $form.title.value, // Event name from the title input
    description: $form.description.value, // Event description from the description input
    date: date, // Event date
    location: $form.location.value, // Event location from the location input
  };

  // Await the addition of the new event, then fetch updated events and re-render
  await addEvent(newEvent);
  await getEvents();
  renderEvents();
});