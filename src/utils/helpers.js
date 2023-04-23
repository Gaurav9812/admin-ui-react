export const GEEKTRUST_URL =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

export const addCheckBox = (selectedCheckbox, value) => {
  let tempMembers = [];
  let index = selectedCheckbox.indexOf(parseInt(value));
  if (index == -1) {
    tempMembers = [...selectedCheckbox, parseInt(value)];
  } else {
    tempMembers = selectedCheckbox.filter(
      (checked) => checked != parseInt(value)
    );
  }
  return tempMembers;
};
