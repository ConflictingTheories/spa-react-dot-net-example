export default class ApiHelper {
  static fetchCategories = async () => {
    let response = await fetch("insurance/categories");
    return response.json();
  };

  static addContent = async (dataObj) => {
    let response= await fetch("insurance/contents/add", {
      method: "POST",
      body: JSON.stringify(dataObj),
      json: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  };

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
