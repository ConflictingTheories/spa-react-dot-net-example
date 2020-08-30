import React, { Component } from "react";
import ApiHelper from "../services/apiHelper";

export class Home extends Component {
  static displayName = Home.name;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      sum: 0,
      chosenCat: null,
      ContentDescription: "",
      ContentValue: 0,
      loading: true,
    };

    this.updateDescription = this.updateDescription.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.updateValue = this.updateValue.bind(this);
    this.renderTable = this.renderTable.bind(this);
  }

  componentDidMount() {
    this.fetchCategories();
  }

  /**
   * @name updateDescription
   * @function Event Listener
   * @param {Event} evt
   */
  updateDescription(evt) {
    this.setState({ ContentDescription: evt.target.value });
  }

  /**
   * @function Event Listener
   * @param {Event} evt Event Object
   */
  updateValue(evt) {
    this.setState({ ContentValue: evt.target.value });
  }

  /**
   * @function Event listener
   * @param {Event} evt Event Object (onChange)
   * @param {int} id Id of Category
   */
  updateCategory(evt, id) {
    this.setState({
      chosenCat: { CategoryName: evt.target.value, Id: id || null },
    });
  }

  /**
   * @function Renders the Insurance Contents Table + Inputs
   */
  renderTable() {
    const categories = this.state.categories;
    return (
      <div>
        <table className="table table-striped" aria-labelledby="tabelLabel">
          <thead>
            <tr>
              <th>Category</th>
              <th>Contents Description</th>
              <th>Value</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((x) =>
              x.contents.map((n, i) => (
                <tr>
                  {i == 0 ? (
                    <td rowSpan={x.contents.length}>
                      <strong>{x.categoryName}</strong>
                      <br />
                      <emph>
                        {"$" +
                          (+x.contents.reduce((s, x) => {
                            return {
                              contentValue: s.contentValue + x.contentValue,
                            };
                          }).contentValue).toFixed(2)}
                      </emph>
                    </td>
                  ) : null}
                  <td>{n.contentDescription}</td>
                  <td>${n.contentValue.toFixed(2)}</td>
                  <td>
                    <button onClick={() => this.deleteContent(n.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <hr />
        <div>
          <h4>
            Total: <strong>${this.state.sum.toFixed(2)}</strong>
          </h4>
        </div>
        <hr />
        <div>
          <label>
            Content Description:
            <input name="name" onChange={this.updateDescription}></input>
          </label>
          <label>
            Content Value ($):
            <input type="number" name="name" onChange={this.updateValue} />
          </label>
          <label>
            Category
            <input
              name="catList"
              list="catList"
              onChange={(evt) => this.updateCategory(evt)}
            />
          </label>
          <datalist id="catList">
            <label>
              or select from the list:
              <select name="catList">
                {categories.map((x) => (
                  <option value={x.Id}>{x.CategoryName}</option>
                ))}
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Jewelry</option>
              </select>
            </label>
          </datalist>
          <button className="btn btn-primary" onClick={() => this.addContent()}>
            Add
          </button>
        </div>
      </div>
    );
  }

  render() {
    let contents = this.state.loading ? (
      <p>
        <em>Loading...</em>
      </p>
    ) : (
      this.renderTable()
    );

    return (
      <div>
        <h1 id="tabelLabel">Contents Insurance List</h1>
        <p>
          This is a simple example of a List for Contents Insurance Item Listing
          &amp; Coverage
        </p>
        {contents}
      </div>
    );
  }

  /**
   * @function Fetches and populates the contents and categories
   */
  async fetchCategories() {
    const data = await ApiHelper.fetchCategories();
    let sum = data
      .map((x) =>
        x.contents.length > 0
          ? x.contents.reduce((s, x) => {
              return { contentValue: s.contentValue + x.contentValue };
            })
          : { contentValue: 0 }
      )
      .reduce((s, x) => {
        return { contentValue: s.contentValue + x.contentValue };
      }).contentValue;
    this.setState({ categories: data, loading: false, sum });
  }

  /**
   * @function Adds content to Category Chosen (Also Makes new Category if non-existant)
   */
  async addContent() {
    const dataObj = {
      ContentDescription: this.state.ContentDescription,
      ContentValue: +this.state.ContentValue,
      CategoryName: this.state.chosenCat.CategoryName,
      CategoryId: this.state.chosenCat.Id,
    };
    await ApiHelper.addContent(dataObj);
    this.fetchCategories();
  }

  /**
   * @function Deletes content from Category
   * @param {int} id - The content id to remove
   */
  async deleteContent(id) {
    await ApiHelper.deleteContent(id);
    this.fetchCategories();
  }
}
