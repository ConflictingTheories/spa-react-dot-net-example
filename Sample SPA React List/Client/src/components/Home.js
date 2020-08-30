import React, { Component } from "react";
import ApiHelper from "../services/apiHelper";

export class Home extends Component {
  static displayName = Home.name;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
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

  updateDescription(evt) {
    this.setState({ ContentDescription: evt.target.value });
  }

  updateValue(evt) {
    this.setState({ ContentValue: evt.target.value });
  }

  updateCategory(evt, id) {
    this.setState({
      chosenCat: { CategoryName: evt.target.value, Id: id || null },
    });
  }

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

  async fetchCategories() {
    const data = await ApiHelper.fetchCategories();
    this.setState({ categories: data, loading: false });
  }

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

  async deleteContent(id) {
    await ApiHelper.deleteContent(id);
    this.fetchCategories();
  }
}
