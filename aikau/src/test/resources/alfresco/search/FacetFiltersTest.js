/**
 * Copyright (C) 2005-2016 Alfresco Software Limited.
 *
 * This file is part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * The purpose of this test is to ensure that keyboard accessibility is possible between the header and the
 * main table. It should be possible to use the tab/shift-tab keys to navigate along the headers (and the enter/space key
 * to make requests for sorting) and then the cursor keys to navigate around the table itself.
 *
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
        function(module, defineSuite, assert, TestCommon, keys) {

   defineSuite(module, {
      name: "FacetFilters Tests (Filter blocking)",
      testPage: "/FacetFilters",

      "Simulate search request": function() {
         return this.remote.findById("DO_FACET_BUTTON_1_label")
            .click()
            .end()

         .findById("SIM_SEARCH_REQUEST_label")
            .clearLog()
            .click()
            .end()

         .findByCssSelector("#FACET1 .alfresco-search-FacetFilter:first-child .details .filterLabel")
            .click()
            .end()

         .getAllPublishes("ALF_APPLY_FACET_FILTER")
            .then(function(payloads) {
               assert.lengthOf(payloads, 0, "Filter click should not be applied");
            });
      },

      "Simulate search results": function() {
         return this.remote.findById("SIM_SEARCH_RESULTS_label")
            .clearLog()
            .click()
            .end()

         .findByCssSelector("#FACET1 .alfresco-search-FacetFilter:first-child .details .filterLabel")
            .click()
            .end()

         .getLastPublish("ALF_APPLY_FACET_FILTER", "Filter click not applied");
      }
   });

   defineSuite(module, {
      name: "FacetFilters Tests (Mouse)",
      testPage: "/FacetFilters",

      "Check no facets are shown to begin with": function() {
         // Check no facets are shown to begin with
         return this.remote.findById("FACET1")
            .getVisibleText()
            .then(function(initialValue) {
               assert.equal(initialValue, "Facet 1", "The only text shown should be 'Facet 1'");
            });
      },

      "Check no facet rows are shown to begin with": function() {
         return this.remote.findAllByCssSelector(".alfresco-search-FacetFilter:not(.hidden)")
            .then(function(rows) {
               assert.lengthOf(rows, 0, "There should be no visible rows in the facet display");
            });
      },

      "Check facets are shown after clicking button 1": function() {
         // Click button 1 - 4 rows of facet data should appear
         return this.remote.findById("DO_FACET_BUTTON_1")
            .click()
            .end()

         .findAllByCssSelector(".alfresco-search-FacetFilter:not(.hidden)")
            .then(function(rows) {
               assert.lengthOf(rows, 4, "There should be 4 rows in the facet display");
            });
      },

      "Check the first set of facets have appeared": function() {
         // Check the facet values
         return this.remote.findById("FACET1")
            .getVisibleText()
            .then(function(facets) {
               assert.include(facets, "result 1", "Facets should contain 'result 1'");
               assert.include(facets, "result 2", "Facets should contain 'result 2'");
               assert.include(facets, "result 3", "Facets should contain 'result 3'");
               assert.include(facets, "result 4", "Facets should contain 'result 4'");
            });
      },

      "Check facets are shown after clicking button 2": function() {
         // Click button 2 - 2 rows of facet data should appear
         return this.remote.findById("DO_FACET_BUTTON_2")
            .click()
            .end()
            .findAllByCssSelector(".alfresco-search-FacetFilter:not(.hidden)")
            .then(function(rows) {
               assert.lengthOf(rows, 2, "There should be 2 rows in the facet display");
            });
      },

      "Check the second set of facets have appeared": function() {
         // Check the facet values
         return this.remote.findById("FACET1")
            .getVisibleText()
            .then(function(facets) {
               assert.include(facets, "result 5", "Facets should contain 'result 5'");
               assert.include(facets, "result 6", "Facets should contain 'result 6'");
            });
      },

      "Check facets are shown after clicking button 3": function() {
         return this.remote // Click button 3 - 4 rows of facet data should appear
            .findById("DO_FACET_BUTTON_3")
            .click()
            .end()
            .findAllByCssSelector(".alfresco-search-FacetFilter:not(.hidden)")
            .then(function(rows) {
               assert.lengthOf(rows, 6, "There should be 6 rows in the facet display");
            });
      },

      "Check the third set of facets have appeared": function() {
         // Check the facet values
         return this.remote.findById("FACET1")
            .getVisibleText()
            .then(function(facets) {
               assert.include(facets, "result 7", "Facets should contain 'result 7'");
               assert.include(facets, "result 8", "Facets should contain 'result 8'");
               assert.include(facets, "result 9", "Facets should contain 'result 9'");
               assert.include(facets, "result 10", "Facets should contain 'result 10'");
               assert.include(facets, "result 11", "Facets should contain 'result 11'");
               assert.include(facets, "Show More", "Facets should contain 'More choices'");
               assert.notInclude(facets, "result 12", "Facets should not contain 'result 12'");
            });
      },

      "Check the four set of facets are shown": function() {
         // Click the more choices button
         return this.remote.findByCssSelector("li.showMore")
            .click()
            .end()

         // Check the facet values
         .findById("FACET1")
            .getVisibleText()
            .then(function(facets) {
               assert.include(facets, "result 7", "Facets should contain 'result 7'");
               assert.include(facets, "result 8", "Facets should contain 'result 8'");
               assert.include(facets, "result 9", "Facets should contain 'result 9'");
               assert.include(facets, "result 10", "Facets should contain 'result 10'");
               assert.include(facets, "result 11", "Facets should contain 'result 11'");
               assert.include(facets, "Show Fewer", "Facets should contain 'Less choices'");
               assert.include(facets, "result 12", "Facets should contain 'result 12'");
            });
      },

      "Check the fifth set of facets are shown": function() {
         // Click the less choices button
         return this.remote.findByCssSelector("li.showLess")
            .click()
            .end()

         // Check the facet values
         .findById("FACET1")
            .getVisibleText()
            .then(function(facets) {
               assert.include(facets, "result 7", "Facets should contain 'result 7'");
               assert.include(facets, "result 8", "Facets should contain 'result 8'");
               assert.include(facets, "result 9", "Facets should contain 'result 9'");
               assert.include(facets, "result 10", "Facets should contain 'result 10'");
               assert.include(facets, "result 11", "Facets should contain 'result 11'");
               assert.include(facets, "Show More", "Facets should contain 'More choices'");
               assert.notInclude(facets, "result 12", "Facets should not contain 'result 12'");
            });
      },

      "Check facet menu is hidden when the title is clicked": function() {
         return this.remote // Click the title - the facet menu should disappear
            .findByCssSelector("#FACET1 > div.label")
            .click()
            .end()

         .findByCssSelector("#FACET1 > ul.filters")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "Facet menu should be hidden when the title is clicked");
            });
      },

      "Check facet menu is shown when the title is clicked again": function() {
         // Click the title again - the facet menu should reappear
         return this.remote.findByCssSelector("#FACET1 > div.label")
            .click()
            .end()

         .findByCssSelector("#FACET1 > ul.filters")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Facet menu should be shown when the title is clicked again");
            });
      },

      "Facet menu item should select when clicked": function() {
         // Click the first facet menu item - it should select
         return this.remote.findByCssSelector("#FACET1 > ul.filters > li:first-of-type span.filterLabel")
            .click()
            .end()

         .findByCssSelector("#FACET1 > ul.filters > li:first-of-type > span.status > span")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Facet menu item should select when clicked");
            })
            .end()

         .getLastPublish("ALF_APPLY_FACET_FILTER");
      },

      "Facet menu item should de-select when clicked again": function() {
         return this.remote // Click the first facet menu item again - it should de-select
            .findByCssSelector("#FACET1 > ul.filters > li:first-of-type span.filterLabel")
            .click()
            .end()
            .findByCssSelector("#FACET1 > ul.filters > li:first-of-type > span.status > span")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "Facet menu item should de-select when clicked again");
            })
            .end()

         .getLastPublish("ALF_REMOVE_FACET_FILTER");
      }
   });

   defineSuite(module, {
      name: "FacetFilters Tests (Keyboard)",
      testPage: "/FacetFilters",

      "Check no facets are shown to begin with": function() {
         // Check no facets are shown to begin with
         return this.remote.findById("FACET1")
            .getVisibleText()
            .then(function(initialValue) {
               assert.equal(initialValue, "Facet 1", "The only text shown should be 'Facet 1'");
            });
      },

      "Check no facet rows are shown to begin with": function() {
         return this.remote.findAllByCssSelector(".alfresco-search-FacetFilter:not(.hidden)")
            .then(function(rows) {
               assert.lengthOf(rows, 0, "There should be no visible rows in the facet display");
            });
      },

      "Check facets are shown after selecting button 1 with the keyboard": function() {
         // 'click' the first button
         return this.remote.pressKeys(keys.TAB)
            .pressKeys(keys.RETURN)
            .end()

         .findAllByCssSelector(".alfresco-search-FacetFilter:not(.hidden)")
            .then(function(rows) {
               assert.lengthOf(rows, 4, "There should be 4 rows in the facet display");
            });
      },

      "Check facet menu is hidden when the title is clicked with the keyboard": function() {
         // Move to the facet menu label and 'click' it
         return this.remote.pressKeys(keys.TAB)
            .pressKeys(keys.TAB)
            .pressKeys(keys.TAB)
            .pressKeys(keys.RETURN)
            .end()

         .findByCssSelector("#FACET1 > ul.filters")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "Facet menu should be hidden when the title is clicked using the keyboard");
            });
      },

      "Check facet menu is displayed when the title is re-clicked with the keyboard": function() {
         // 'Click' the menu label again to re-show the menu
         return this.remote.pressKeys(keys.RETURN)
            .end()

         .findByCssSelector("#FACET1 > ul.filters")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Facet menu should be displayed when the title is re-clicked using the keyboard");
            });
      },

      "Facet menu item should select when clicked with the keyboard": function() {
         // Tab onto the first facet in the menu and 'click' it - it should select
         return this.remote.pressKeys(keys.TAB)
            .pressKeys(keys.RETURN)
            .end()

         .findByCssSelector("#FACET1 > ul.filters > li:first-of-type > span.status > span")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Facet menu item should select when clicked using the keyboard");
            })
            .end()

         .getLastPublish("ALF_APPLY_FACET_FILTER");
      },

      "Facet menu item should de-select when clicked again using the keyboard": function() {
         // 'Click' the first facet menu item again - it should de-select
         return this.remote.pressKeys(keys.RETURN)
            .end()

         .findByCssSelector("#FACET1 > ul.filters > li:first-of-type > span.status > span")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "Facet menu item should de-select when clicked again using the keyboard");
            })
            .end()

         .getLastPublish("ALF_REMOVE_FACET_FILTER");
      },

      "Hits don't toggle on facet 1": function() {
         return this.remote.findByCssSelector("#FACET1 .hits")
            .clearLog()
            .click()
            .end()

         .getAllPublishes("ALF_APPLY_FACET_FILTER")
            .then(function(payloads) {
               assert.lengthOf(payloads, 0, "Filter should not be toggled clicking on hits");
            });
      },

      "Hits do toggle on facet 2": function() {
         return this.remote.findById("DO_FACET_BUTTON_4_label")
            .click()
            .end()

         .findDisplayedByCssSelector("#FACET2 .hits")
            .click()
            .end()

         // NOTE: #FACET2 has a different topic on click from #FACET1
         .getLastPublish("ALF_NAVIGATE_TO_PAGE", "Filter was not toggled clicking on hits");
      }
   });

   defineSuite(module, {
      name: "FacetFilters Tests (URL Hash Tests)",
      testPage: "/FacetFilters",

      "Check facets are shown after clicking button 4": function() {
         // Click button 4 - 3 rows of facet data should appear
         return this.remote.findById("DO_FACET_BUTTON_4")
            .click()
            .end()

         .findAllByCssSelector(".alfresco-search-FacetFilter:not(.hidden)")
            .then(function(rows) {
               assert.lengthOf(rows, 3, "There should be 3 rows in the facet display");
            });
      },

      "Click the first item in the facet menu": function() {
         return this.remote // Click facet1 - check the url hash appears as expected
            .findByCssSelector("#FACET2 > ul.filters > li:first-of-type span.filterLabel")
            .click()
            .end()

         .getCurrentUrl()
            .then(function(url) {
               assert.include(url, "FACET2QNAME", "The url hash should contain 'FACET2QNAME'");
               assert.include(url, "facFil1", "The facet click did not write the value 'facFil1' to the url hash as expected");
            });
      },

      "Click the second item in the facet menu": function() {
         return this.remote // Click facet2 - check the url hash appears as expected
            .findByCssSelector("#FACET2 > ul.filters > li:nth-of-type(2) span.filterLabel")
            .click()
            .end()

         .getCurrentUrl()
            .then(function(url) {
               assert.include(url, "FACET2QNAME", "The url hash should contain 'FACET2QNAME'");
               assert.include(url, "facFil1", "The url hash should contain 'facFil2'");
               assert.include(url, "facFil2", "The facet click did not add the value 'facFil2' to the url hash as expected");
            });
      },

      "Click the first item in the facet menu again": function() {
         return this.remote // Click facet1 - check the url hash appears as expected
            .findByCssSelector("#FACET2 > ul.filters > li:first-of-type span.filterLabel")
            .click()
            .end()

         .getCurrentUrl()
            .then(function(url) {
               assert.include(url, "FACET2QNAME", "The url hash should contain 'FACET2QNAME'");
               assert.notInclude(url, "facFil1", "The facet click did not remove the value 'facFil1' from the url hash as expected");
            });
      },

      "Click the second item in the facet menu again": function() {
         return this.remote // Click facet2 - check the url hash appears as expected
            .findByCssSelector("#FACET2 > ul.filters > li:nth-of-type(2) span.filterLabel")
            .click()
            .end()

         .getCurrentUrl()
            .then(function(url) {
               assert.notInclude(url, "FACET2QNAME", "The url hash should not now contain 'FACET2QNAME'");
               assert.notInclude(url, "facFil2", "The facet click did not remove the value 'facFil2' from the url hash as expected");
            });
      }
   });

   // See AKU-477...
   // FacetFilters publish information about themselves when they are created, but they wait for
   // page loading to complete so that all widgets have been created before publishing occurs.
   defineSuite(module, {
      name: "FacetFilters Tests (delayed creation)",
      testPage: "/FacetFilters",

      "Facet filters should not exist in tab container on page load": function() {
         return this.remote.findAllByCssSelector("#TAB_CONTAINER .alfresco-search-FacetFilter")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Facet filters unexpectedly existed in tab container");
            });
      },

      "Check publications on delayed creation": function() {
         return this.remote.findByCssSelector(".dijitTabInner:nth-child(2)")
            .clearLog()
            .click()
            .end()
            .getLastPublish("ALF_INCLUDE_FACET");
      }
   });
});