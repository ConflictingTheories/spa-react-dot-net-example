export default class ApiHelper {
  /**
   * @function API Call - Returns Insurance Contents
   */
  static fetchCategories = async () => {
    let response = await fetch("insurance/categories");
    return response.json();
  };

  /**
   * @function API Call - Adds Insurance Content to Category (will make if necessary)
   * @param {InsuranceContentRequest} dataObj - Data Object Details for Creation
   */
  static addContent = async (dataObj) => {
    let response = await fetch("insurance/contents/add", {
      method: "POST",
      body: JSON.stringify(dataObj),
      json: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  };

  /**
   * @function API Call - Delete Contents
   * @param {int} id - Id of Content to Delete
   */
  static deleteContent = async (id) => {
    let response = await fetch(`insurance/contents/delete/${id}`, {
      method: "POST",
      json: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  };
}
