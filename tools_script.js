const UItoJSON = {
    "Target": "TARGET",
    "Data Format": "DATA",
    "Visualization": "VISUALIZATION",
    "Programming Languages": "TECHNOLOGIES",
    "Required Tools": "INTEGRATION",
    "Assumptions": "ASSUMPTIONS",
    "User-Oriented Metrics": "USER_METRICS",
    "System-Oriented Metrics": "SYSTEM_METRICS",
    "Tracing": "TRACING",
    "Logging": "EVENTS_LOGGING",
    "Quality Attributes": "TARGET_QUALITY_ATTRIBUTE",
    "Patterns": "MONITORING_PATTERN",
    "Granularity": "MONITORING_GRANULARITY",
    "Instrumentation Mechanisms": "INSTRUMENTATION",
    "Integration": "INTEGRATION_WITH_TESTING"
};


const challengesMapping = {
    "MC1": "Collection of monitoring metrics data and logs from containers",
    "MC2": "Distributed tracing",
    "MC3": "Many components to monitor (complexity)",
    "MC4": "Performance monitoring",
    "MC5": "Analyzing the collected data",
    "MC6": "Failure zone detection",
    "MC7": "Availability of the monitoring tools",
    "MC8": "Monitoring of application running in containers",
    "MC9": "Maintaining monitoring infrastructures"
};

let allTools = [];

async function loadToolsData() {
    const response = await fetch('monitoring_tools.json'); // Adjust the path as necessary
    const data = await response.json();
    return data;
}

function filterData(queryParams) {
    return allTools.filter(item => {
        return Object.entries(queryParams).every(([key, value]) => {
            if (!item[key]) return true; 
            if (typeof item[key] === 'boolean') {
                return item[key] === (value.toLowerCase() === 'yes');
            } else {
                return item[key].toString().toLowerCase().includes(value.toLowerCase());
            }
        });
    });
}

function searchTools() {
    const searchTerm = document.getElementById('searchTerm').value;

    const filteredData = filterData({ Name: searchTerm });
    displayResults(filteredData);
}

function fetchAndDisplayTools() {
    const firstRelease = document.getElementById('firstRelease').value;
    const openSource = document.getElementById('openSource').checked ? 'Yes' : '';
    const queryParams = {"FIRST_RELEASE": firstRelease, "OPEN_SOURCE": openSource};

    const filteredData = filterData(queryParams);
    displayResults(filteredData);

}


function displayResults(tools) {
    const resultsContainer = document.getElementById('results');
    const initialDisplayCount = 10; 
    resultsContainer.innerHTML = ''; // Clear previous results

    if (tools.length > 0) {
        tools.slice(0, initialDisplayCount).forEach(tool => {
            const toolBox = document.createElement('div');
            toolBox.className = 'tool-box'; // Assign a class for styling

            const toolName = document.createElement('h3');
            toolName.textContent = `${tool.ID}. ${tool.Name}`;
            toolBox.appendChild(toolName);

            const toolYear = document.createElement('p');
            toolYear.textContent = `Year: ${tool.YEAR}`;
            toolBox.appendChild(toolYear);

            const toolProvider = document.createElement('p');
            toolProvider.textContent = `Provider: ${tool.Provider}`;
            toolBox.appendChild(toolProvider);

            const toolChallenges = document.createElement('strong');
            toolChallenges.textContent = `Addressed Challenges:`;
            toolBox.appendChild(toolChallenges);

            const challengesList = document.createElement('ul');
            tool.ADDRESSED_CHALLENGES.split(',').forEach(code => {
                const challenge = document.createElement('li');
                challenge.textContent = challengesMapping[code.trim()]; 
                challengesList.appendChild(challenge);
            });
            toolBox.appendChild(challengesList);

            if (tool.Link && tool.Link.startsWith('http')) { 
                const toolLink = document.createElement('a');
                toolLink.href = tool.Link;
                toolLink.textContent = 'Tool Link';
                toolLink.target = '_blank'; // Open in new tab
                toolLink.className = 'tool-link-button';
                toolBox.appendChild(toolLink);
            }

            resultsContainer.appendChild(toolBox);
        });

        if (tools.length > initialDisplayCount) {
            const divButton = document.createElement('div');
            divButton.className = 'divButton';
            
            const showMoreBtn = document.createElement('button');
            showMoreBtn.className = 'showMoreBtn';
            showMoreBtn.textContent = 'Show All';
            showMoreBtn.onclick = () => showAllResults(tools); // Function to display all results
            divButton.appendChild(showMoreBtn);

            resultsContainer.appendChild(divButton);
        }

    } else {
        resultsContainer.innerHTML = '<p>No results found.</p>';
    }
}

function showAllResults(tools) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    tools.forEach(tool => {
        const toolBox = document.createElement('div');
            toolBox.className = 'tool-box';

            const toolName = document.createElement('h3');
            toolName.textContent = `${tool.ID}. ${tool.Name}`;
            toolBox.appendChild(toolName);

            const toolYear = document.createElement('p');
            toolYear.textContent = `Year: ${tool.YEAR}`;
            toolBox.appendChild(toolYear);

            const toolProvider = document.createElement('p');
            toolProvider.textContent = `Provider: ${tool.Provider}`;
            toolBox.appendChild(toolProvider);

            const toolChallenges = document.createElement('strong');
            toolChallenges.textContent = `Addressed Challenges:`;
            toolBox.appendChild(toolChallenges);

            const challengesList = document.createElement('ul');
            tool.ADDRESSED_CHALLENGES.split(',').forEach(code => {
                const challenge = document.createElement('li');
                challenge.textContent = challengesMapping[code.trim()]; 
                challengesList.appendChild(challenge);
            });
            toolBox.appendChild(challengesList);

            if (tool.Link && tool.Link.startsWith('http')) { 
                const toolLink = document.createElement('a');
                toolLink.href = tool.Link;
                toolLink.textContent = 'Tool Website';
                toolLink.target = '_blank'; // Open in new tab
                toolLink.className = 'tool-link-button';
                toolBox.appendChild(toolLink);
            }

            resultsContainer.appendChild(toolBox);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Attach an event listener to all checkboxes within the dropdown-content class
    document.querySelectorAll('.dropdown-content input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Call the filtering function whenever a checkbox changes state
            applyFilters();
        });
    });
});

function applyFilters() {
    let filters = {};

    document.querySelectorAll('.content-options').forEach(category => {
        const categoryText = category.querySelector('.contentbtn').textContent.trim();
        const categoryKey = UItoJSON[categoryText];
        let selectedOptions = [];

        category.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            selectedOptions.push(checkbox.name);
        });

        if (selectedOptions.length > 0) {
            filters[categoryKey] = selectedOptions;
        }
    });

    const filteredTools = filterTools(allTools, filters);
    displayResults(filteredTools);
}

function filterTools(tools, filters) {
    return tools.filter(tool => {
        return Object.entries(filters).every(([category, options]) => {
            const toolValue = tool[category];
            if (!toolValue) return false; // If the tool doesn't have the category, exclude it

            if (typeof toolValue === 'boolean') {
                return options.includes(toolValue.toString());
            } else {
                const toolValuesArray = toolValue.split(',').map(item => item.trim().toLowerCase());
                return options.every(option =>
                    toolValuesArray.includes(option.trim().toLowerCase()));
            }
        });
    });
}

document.querySelectorAll('.dropbtn').forEach(button => {
    button.onclick = function() {
        this.nextElementSibling.classList.toggle("show");
    }
});

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}


window.onload = () => {
    fetch('/Tools/monitoring_tools.json')
        .then(response => response.json())
        .then(data => {
            allTools = data; 
            displayResults(data); 
        })
        .catch(error => console.error('Error loading tools data:', error));
};
