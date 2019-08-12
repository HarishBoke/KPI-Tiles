const currentDocument = document.currentScript.ownerDocument;

class KPITiles extends HTMLElement{
    constructor(){
        super();
        this.addEventListener('click', e => this.toggleTile());
    }
    render(kpiData) {
        // Fill the respective areas of the card using DOM manipulation APIs
        // All of our components elements reside under shadow dom. So we created a this.shadowRoot property
        // We use this property to call selectors so that the DOM is searched only under this subtree
        this.shadowRoot.querySelector('.card__full-name').innerHTML = kpiData.name;
        this.shadowRoot.querySelector('.card__user-name').innerHTML = kpiData.username;
        this.shadowRoot.querySelector('.card__website').innerHTML = kpiData.website;
        this.shadowRoot.querySelector('.card__address').innerHTML = `<h4>Address</h4>
          ${kpiData.address.suite}, <br />
          ${kpiData.address.street},<br />
          ${kpiData.address.city},<br />
          Zipcode: ${kpiData.address.zipcode}`
      }
    
      toggleTile() {
        console.log('tile has clicked!');
        let elem = this.shadowRoot.querySelector('.card__hidden-content');
        let btn = this.shadowRoot.querySelector('.card__details-btn');
        btn.innerHTML = elem.style.display == 'none' ? 'Less Details' : 'More Details';
        elem.style.display = elem.style.display == 'none' ? 'block' : 'none';
      }   
    connectedCallback(){
        const shadowRoot = this.attachShadow({mode: 'open'});

        // Select the template and clone it. Finally attach the cloned node to the shadowDOM's root.
        // Current document needs to be defined to get DOM access to imported HTML
        const template = currentDocument.querySelector('#KPI-tiles-template');
        const instance = template.content.cloneNode(true);
        shadowRoot.appendChild(instance);

        // Extract the attribute user-id from our element. 
        // Note that we are going to specify our cards like: 
        // <kpi-tiles kpi-id="1"></kpi-tiles>
        const userId = this.getAttribute('kpi-id');

        // Fetch the data for that user Id from the API and call the render method with this data
        fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
            .then((response) => response.text())
            .then((responseText) => {
                this.render(JSON.parse(responseText));
            })
            .catch((error) => {
                console.error(error);
            }); 
    }
}
customElements.define('kpi-tiles', KPITiles);
