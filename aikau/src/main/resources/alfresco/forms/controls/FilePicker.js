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
 * Services required:
 * - SearchService, SiteService, DocumentService
 * 
 * 
 * @module alfresco/forms/controls/FilePicker
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 * @since 1.0.78
 */
define(["dojo/_base/declare",
        "alfresco/forms/controls/BaseFormControl",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/core/topics",
        "dojo/_base/lang"],
        function(declare, BaseFormControl, CoreWidgetProcessing, topics, lang) {



   return declare([BaseFormControl, CoreWidgetProcessing], {

      /**
       * 
       * 
       * 
       */
      createFormControl: function alfresco_forms_controls_FilePicker__createFormControl(config) {
         // TODO: Scoping of tabs is required...


         // Generate some unique topics for this form control to avoid any cross-contamination
         // of other instances of the widget within the same scope...
         this.recentSitesRequestTopic = this.generateUuid();
         this.favouriteSitesRequestTopic = this.generateUuid();
         this.showRecentSiteBrowserTopic = this.generateUuid();

         // TODO: Generate recent and favourite site fieldIds

         // Set up the subscriptions to handle publication of the generated topics...
         this.alfSubscribe(this.recentSitesRequestTopic, lang.hitch(this, this.onRecentSitesOptionsRequest));
         this.alfSubscribe(this.favouriteSitesRequestTopic, lang.hitch(this, this.onFavouriteSitesOptionsRequest));
         
         // TODO: Set up subscription to valueChangeOf generated Select control fieldIds for recent and favourite sites

         var widgets = lang.clone(this.widgetsForDialog);
         this.processObject(["processInstanceTokens"], widgets);

         var button = this.createWidget({
            id: this.id + "_SHOW_FILE_PICKER_DIALOG",
            name: "alfresco/buttons/AlfButton",
            config: {
               label: "Choose a file", // Localization
               publishTopic: topics.CREATE_DIALOG,
               publishPayload: {
                  dialogId: this.id + "_FILE_PICKER_DIALOG",
                  dialogTitle: "Choose a file", 
                  widgetsContent: widgets,
                  contentWidth: "700px"
               },
               publishGlobal: true
            }
         });
         return button;
      },

      onRecentSitesOptionsRequest: function alfresco_forms_controls_FilePicker__onRecentSitesOptionsRequest(payload) {
         // TODO: Get the recent sites and convert to friendly structure for form control
      },

      onFavouriteSitesOptionsRequest: function alfresco_forms_controls_FilePicker__onFavouriteSitesOptionsRequest(payload) {
         // TODO
      },

      onShowRecentSiteBrowser: function alfresco_forms_controls_FilePicker__onShowRecentSiteBrowser(payload) {
         // TODO: Get the requested site id and publish the widget model for browsing that site...
      },


      /**
       * [widgetsForDialog description]
       * @type {Array}
       */
      widgetsForDialog: [
         {
            id: "{id}_TABCONTAINER",
            name: "alfresco/layout/AlfTabContainer",
            config: {
               widgets: [
                  {
                     id: "{id}_SEARCH_TAB",
                     title: "Search", // TODO: Localization
                     name: "alfresco/layout/VerticalWidgets",
                     config: {
                        pubSubScope: "SEARCH",
                        widgetMarginTop: 10,
                        widgets: [
                           {
                              id: "{id}_SEARCH_FIELD",
                              name: "alfresco/forms/SingleComboBoxForm",
                              config: {
                                 useHash: true,
                                 okButtonLabel: "Search", // TODO: Localization
                                 okButtonPublishTopic : "ALF_SET_SEARCH_TERM",
                                 okButtonPublishGlobal: false,
                                 okButtonIconClass: "alf-white-search-icon",
                                 okButtonClass: "call-to-action",
                                 textFieldName: "searchTerm",
                                 textBoxIconClass: "alf-search-icon",
                                 textBoxCssClasses: "long hiddenlabel",
                                 textBoxLabel: "Search label", // TODO: Localization
                                 queryAttribute: "term",
                                 optionsPublishTopic: "ALF_AUTO_SUGGEST_SEARCH",
                                 optionsPublishPayload: {
                                    resultsProperty: "response.suggestions"
                                 }
                              }
                           },
                           {
                              id: "{id}_SEARCH_RESULTS",
                              name: "alfresco/documentlibrary/AlfSearchList",
                              config: {
                                 waitForPageWidgets: false,
                                 loadDataImmediately: false,
                                 useHash: false,
                                 selectedScope: "repo",
                                 useInfiniteScroll: true,
                                 siteId: null,
                                 rootNode: null, 
                                 repo: true,
                                 widgets: [
                                    {
                                       id: "FCTSRCH_SEARCH_ADVICE_NO_RESULTS",
                                       name: "alfresco/documentlibrary/views/AlfSearchListView",
                                       config: {
                                          widgetsForNoDataDisplay: null, // TODO
                                          widgets: [
                                             {
                                                id: "FCTSRCH_SEARCH_RESULT",
                                                name: "alfresco/search/AlfSearchResult",
                                                config: {
                                                   enableContextMenu: false
                                                }
                                             }
                                          ]
                                       }
                                    }
                                 ]
                              }
                           }
                        ]
                     }
                  },
                  {
                     id: "{id}_RECENT_SITES_TAB",
                     title: "Recent Sites", // TODO: Localization
                     name: "alfresco/layout/VerticalWidgets",
                     config: {
                        pubSubScope: "RECENT",
                        widgetMarginTop: 10,
                        widgets: [
                           {
                              name: "alfresco/forms/controls/Select",
                              config: {
                                 fieldId: "RECENT_SITE_SELECTION", // TODO: Generate unique field Id and use here...
                                 label: "Recent site", // TODO: Localization
                                 name: "recentSite",
                                 optionsConfig: {
                                    publishTopic: "{recentSitesRequestTopic}" // TODO: Might need internal topic for handle options
                                    // TODO: Need to publish topic for recent sites
                                 }
                              }
                           },
                           {
                              name: "alfresco/layout/DynamicWidgets",
                              config: {
                                 subscriptionTopic: "{showRecentSiteBrowserTopic}" // TODO: Needs topic published by widget
                              }
                           }
                        ]
                     }
                  },
                  {
                     id: "{id}_FAVOURITE_SITES_TAB",
                     title: "Favourite Sites", // TODO: Localization
                     name: "alfresco/layout/VerticalWidgets",
                     config: {
                        pubSubScope: "FAVOURITES"
                        
                     }
                  },
                  {
                     id: "{id}_REPOSITORY_TAB",
                     title: "Repository", // TODO: Localization
                     name: "alfresco/layout/VerticalWidgets",
                     config: {
                        pubSubScope: "REPOSITORY",
                        widgetMarginTop: 10,
                        widgets: [
                           {
                              name: "alfresco/layout/HorizontalWidgets",
                              config: {
                                 widgets: [
                                    {
                                       name: "alfresco/navigation/PathTree",
                                       config: {
                                          siteId: null,
                                          containerId: null,
                                          rootNode: "alfresco://company/home", // TODO: Required for this widget
                                          rootLabel: "Repository", // TODO: Localization
                                          useHash: false
                                       }
                                    },
                                    {
                                       name: "alfresco/documentlibrary/AlfDocumentList",
                                       config: {
                                          waitForPageWidgets: false,
                                          rawData: false,
                                          useHash: false,
                                          siteId: null,
                                          containerId: null,
                                          rootNode: null,
                                          usePagination: true,
                                          showFolders: true,
                                          sortAscending: true,
                                          sortField: "cm:name", // TODO: Check this
                                          widgets: [
                                             {
                                                name: "alfresco/documentlibrary/views/AlfSimpleView"
                                             }
                                          ]
                                       }
                                    }
                                 ]
                              }
                           }
                        ]
                     }
                  }
               ]
            }
         }
      ]
   });
});