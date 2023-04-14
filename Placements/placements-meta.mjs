import axios from "axios";

const restUrl = "https://rest42.bullhornstaffing.com/rest-services/6rmuc9/";

export async function getMeta(BhRestToken) {
  try {
    const metaResponse = await axios.get(
      `${restUrl}meta/Placement?BhRestToken=${BhRestToken}&meta=full&count=200&start=0&fields=*`
    );
    const fields = metaResponse.data.fields;

    //const fieldsArray =
    const fieldsArray = fields.map((field) => {
      return {
        name: field.name,
        label: field.label,
      };
    });
    //console.log(`fieldsArray`, fieldsArray);

    console.log(`fieldsArray`, JSON.stringify(fieldsArray, null, 2));

    //const reformattedArray = fieldsArray.join(",");
    //console.log(`reformattedArray`, reformattedArray);
    return fieldsArray; // Return the array of objects instead of the reformattedArray
  } catch (error) {
    console.log(`Second API call error`, error);
  }
}
