async function searchBooks() {
    document.getElementById('bookResultsContainer').innerHTML = '';

    const bookHeading = document.getElementById('bookHeading').value.trim();

    if (bookHeading === '') {
        alert('Please enter a book heading.');
        return;
    }

    try {
        const apiKey = 'AIzaSyDzgrtIRmztMMZwdeF_2JA-s290OkKeyO8';
        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(bookHeading)}&key=${apiKey}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        displayBookResults(data.items);
    } catch (error) {
        console.error('Error fetching book references:', error);
    }
}

function displayBookResults(results) {
    const bookResultsContainer = document.getElementById('bookResultsContainer');

    if (!results || results.length === 0) {
        bookResultsContainer.innerHTML = '<p>No book results found.</p>';
        return;
    }

    const resultList = document.createElement('ul');

    results.forEach(result => {
        const listItem = document.createElement('li');

        const title = result.volumeInfo.title || 'Title not available';
        const author = result.volumeInfo.authors ? result.volumeInfo.authors.join(', ') : 'Author not available';
        const publicationYear = result.volumeInfo.publishedDate || 'Publication year not available';
        const publisher = result.volumeInfo.publisher || 'Publisher not available';

        // Generate Harvard referencing style citation for books
        const harvardCitation = generateHarvardCitation(author, publicationYear, title, publisher);

        // Construct the content for each result including the citation and copy button
        listItem.innerHTML = `
            <div class="result-container">
                <strong>Title:</strong> ${title} <br>
                <strong>Author(s):</strong> ${author} <br>
                <strong>Publication Year:</strong> ${publicationYear} <br>
                <strong>Publisher:</strong> ${publisher} <br>
                <strong>Harvard Citation:</strong> <span id="citation${results.indexOf(result)}">${harvardCitation}</span>
                <button class="copy-button" onclick="copyToClipboard('citation${results.indexOf(result)}')">Copy</button>
            </div>
        `;

        resultList.appendChild(listItem);
    });

    bookResultsContainer.innerHTML = ''; // Clear previous book results
    bookResultsContainer.appendChild(resultList);
}

function referenceWebsite() {
    const websiteTitle = document.getElementById('websiteTitle').value.trim();
    const websiteURL = document.getElementById('websiteURL').value.trim();

    if (websiteTitle === '' || websiteURL === '') {
        alert('Please enter both website title and URL.');
        return;
    }

    const websiteReferenceContainer = document.getElementById('websiteReferenceContainer');

    // Generate Harvard referencing style citation for websites
    const harvardCitation = generateHarvardCitation('', '', websiteTitle, websiteURL, true);

    // Construct the content including the citation and copy button for websites
    websiteReferenceContainer.innerHTML = `
        <div class="result-container">
            <strong>Website Reference:</strong> <span id="websiteCitation">${harvardCitation}</span>
            <button class="copy-button" onclick="copyToClipboard('websiteCitation')">Copy</button>
        </div>
    `;
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    
    // Create a temporary textarea element to copy the text
    const textarea = document.createElement('textarea');
    textarea.value = element.textContent;
    document.body.appendChild(textarea);
    textarea.select();
    
    // Copy the text to the clipboard
    document.execCommand('copy');
    
    // Remove the temporary textarea
    document.body.removeChild(textarea);

    alert('Copied to clipboard!');
}

function generateHarvardCitation(author, year, title, publisher, isWebsite = false) {
    if (isWebsite) {
        return `${title}. [Online] Available at: ${publisher} [Accessed: ${getCurrentDate()}]`;
    } else {
        return `${author} (${year}) ${title}. ${publisher}.`;
    }
}

function getCurrentDate() {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.toLocaleString('en-US', { month: 'long' });
    const year = currentDate.getFullYear();
    return `${day} ${month} ${year}`;
}
