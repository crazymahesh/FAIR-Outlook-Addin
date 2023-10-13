/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty */
/* eslint-disable prettier/prettier */
/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office, console */

let item;
Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
	item = Office.context.mailbox.item;
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    //getCategories();
     document.getElementById("apply-categories").onclick = function(){
      console.log(document.getElementById("parentMep").value);
      applyCategories();
     };
    // document.getElementById("categories-container").onclick = function () {
    //   clearElement("notification");
    // };
    //getAppliedCategories();
  }
});

/**
 * Get the categories associated with the event-based add-in.
 */
function getCategories() {
  Office.context.mailbox.masterCategories.getAsync((asyncResult) => {
    if (asyncResult.status === Office.AsyncResultStatus.Failed) {
      return;
    }

    let selection = document.createElement("select");
    selection.name = "applicable-categories";
    selection.id = "applicable-categories";
    selection.multiple = true;
    let label = document.createElement("label");
    label.innerHTML =
      "<br/>Select the applicable categories.<br/><br/>Select and hold <b>Ctrl</b> to choose multiple categories.<br/>";
    label.htmlFor = "applicable-categories";

    asyncResult.value.forEach((category, index) => {
      let displayName = category.displayName;
      if (displayName.includes("Office Add-ins Sample: ")) {
        let option = document.createElement("option");
        option.value = index;
        option.text = category.displayName;
        selection.appendChild(option);
        selection.size++;
      }
    });

    document.getElementById("categories-container").appendChild(label).appendChild(selection);
  });
}

function write(message) {
    document.getElementById("message").innerText += message; 
}

/**
 * Apply the selected categories to the message or appointment.
 */
function applyCategories() {
	var selectedParentMep = document.getElementById("parentMep").value;
  document.getElementById("pmSelect").innerText = selectedParentMep;
	item.subject.setAsync(
        selectedParentMep,
        { asyncContext: { optionalVariable1: 1, optionalVariable2: 2 } },
        (asyncResult) => {
            if (asyncResult.status === Office.AsyncResultStatus.Failed) {
                write(asyncResult.error.message);
                return;
            }

            /*
              The subject was successfully set.
              Run additional operations appropriate to your scenario and
              use the optionalVariable1 and optionalVariable2 values as needed.
            */
        });
  // let selectedCategories = getSelectedCategories("applicable-categories");
  // if (selectedCategories.length > 0) {
    // Office.context.mailbox.item.categories.addAsync(
      // selectedCategories,
      // (asyncResult) => {
        // if (asyncResult.status === Office.AsyncResultStatus.Failed) {
          // return;
        // }

        // document.getElementById("notification").innerHTML =
          // "<i>Selected categories have been applied.</i>";
        // getAppliedCategories();
        // clearSelection("applicable-categories");
      // }
    // );
  // } else {
    // document.getElementById("notification").innerHTML =
      // "<i>Select categories to be applied.</i>";
  // }
}

/**
 * Get the selected categories from the task pane.
 * @param {string} id The ID of the HTML element where categories are selected.
 * @returns {string[]} The selected category names.
 */
function getSelectedCategories(id) {
  let selectedCategories = [];
  for (let category of document.getElementById(id).options) {
    if (category.selected) {
      selectedCategories.push(category.text);
    }
  }

  return selectedCategories;
}

/**
 * Get the categories that are applied to the message or appointment.
 */
function getAppliedCategories() {
  clearElement("applied-categories-container");

  Office.context.mailbox.item.categories.getAsync((asyncResult) => {
    if (asyncResult.status === Office.AsyncResultStatus.Failed) {}
    
    let categories = asyncResult.value;
    if (categories) {
      let categoryList = document.createElement("ul");
      categories.forEach((category) => {
        let appliedCategory = document.createElement("li");
        appliedCategory.innerText = category.displayName;
        categoryList.appendChild(appliedCategory);
      });

      document
        .getElementById("applied-categories-container")
        .appendChild(categoryList);
    } else {
      let notification = document.createElement("p");
      notification.innerText = "No categories have been applied.";
      document
        .getElementById("applied-categories-container")
        .appendChild(notification);
    }
  });
}


/**
 * Clear the contents of an HTML element.
 * @param {string} id The ID of the HTML element to be cleared.
 */
function clearElement(id) {
  document.getElementById(id).innerHTML = "";
}

/**
 * Clear the selected options in the <select> element.
 * @param {string} id The ID of the <select> element to be cleared.
 */
function clearSelection(id) {
  document.getElementById(id).options.forEach((option) => {
    if (option.selected) {
      option.selected = false;
    }
  });
}
