var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var _a, _b;
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import React3, { Component, forwardRef, createElement, useEffect, useState, useRef, useCallback, useMemo } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.mjs";
import fastCompare from "react-fast-compare";
import invariant from "invariant";
import shallowEqual from "shallowequal";
import { useLocation, Link, NavLink, useNavigate, useParams, Routes, Route } from "react-router-dom";
var TAG_NAMES = /* @__PURE__ */ ((TAG_NAMES2) => {
  TAG_NAMES2["BASE"] = "base";
  TAG_NAMES2["BODY"] = "body";
  TAG_NAMES2["HEAD"] = "head";
  TAG_NAMES2["HTML"] = "html";
  TAG_NAMES2["LINK"] = "link";
  TAG_NAMES2["META"] = "meta";
  TAG_NAMES2["NOSCRIPT"] = "noscript";
  TAG_NAMES2["SCRIPT"] = "script";
  TAG_NAMES2["STYLE"] = "style";
  TAG_NAMES2["TITLE"] = "title";
  TAG_NAMES2["FRAGMENT"] = "Symbol(react.fragment)";
  return TAG_NAMES2;
})(TAG_NAMES || {});
var SEO_PRIORITY_TAGS = {
  link: { rel: ["amphtml", "canonical", "alternate"] },
  script: { type: ["application/ld+json"] },
  meta: {
    charset: "",
    name: ["generator", "robots", "description"],
    property: [
      "og:type",
      "og:title",
      "og:url",
      "og:image",
      "og:image:alt",
      "og:description",
      "twitter:url",
      "twitter:title",
      "twitter:description",
      "twitter:image",
      "twitter:image:alt",
      "twitter:card",
      "twitter:site"
    ]
  }
};
var VALID_TAG_NAMES = Object.values(TAG_NAMES);
var REACT_TAG_MAP = {
  accesskey: "accessKey",
  charset: "charSet",
  class: "className",
  contenteditable: "contentEditable",
  contextmenu: "contextMenu",
  "http-equiv": "httpEquiv",
  itemprop: "itemProp",
  tabindex: "tabIndex"
};
var HTML_TAG_MAP = Object.entries(REACT_TAG_MAP).reduce(
  (carry, [key, value]) => {
    carry[value] = key;
    return carry;
  },
  {}
);
var HELMET_ATTRIBUTE = "data-rh";
var HELMET_PROPS = {
  DEFAULT_TITLE: "defaultTitle",
  DEFER: "defer",
  ENCODE_SPECIAL_CHARACTERS: "encodeSpecialCharacters",
  ON_CHANGE_CLIENT_STATE: "onChangeClientState",
  TITLE_TEMPLATE: "titleTemplate",
  PRIORITIZE_SEO_TAGS: "prioritizeSeoTags"
};
var getInnermostProperty = (propsList, property) => {
  for (let i = propsList.length - 1; i >= 0; i -= 1) {
    const props = propsList[i];
    if (Object.prototype.hasOwnProperty.call(props, property)) {
      return props[property];
    }
  }
  return null;
};
var getTitleFromPropsList = (propsList) => {
  let innermostTitle = getInnermostProperty(
    propsList,
    "title"
    /* TITLE */
  );
  const innermostTemplate = getInnermostProperty(propsList, HELMET_PROPS.TITLE_TEMPLATE);
  if (Array.isArray(innermostTitle)) {
    innermostTitle = innermostTitle.join("");
  }
  if (innermostTemplate && innermostTitle) {
    return innermostTemplate.replace(/%s/g, () => innermostTitle);
  }
  const innermostDefaultTitle = getInnermostProperty(propsList, HELMET_PROPS.DEFAULT_TITLE);
  return innermostTitle || innermostDefaultTitle || void 0;
};
var getOnChangeClientState = (propsList) => getInnermostProperty(propsList, HELMET_PROPS.ON_CHANGE_CLIENT_STATE) || (() => {
});
var getAttributesFromPropsList = (tagType, propsList) => propsList.filter((props) => typeof props[tagType] !== "undefined").map((props) => props[tagType]).reduce((tagAttrs, current) => ({ ...tagAttrs, ...current }), {});
var getBaseTagFromPropsList = (primaryAttributes, propsList) => propsList.filter((props) => typeof props[
  "base"
  /* BASE */
] !== "undefined").map((props) => props[
  "base"
  /* BASE */
]).reverse().reduce((innermostBaseTag, tag) => {
  if (!innermostBaseTag.length) {
    const keys = Object.keys(tag);
    for (let i = 0; i < keys.length; i += 1) {
      const attributeKey = keys[i];
      const lowerCaseAttributeKey = attributeKey.toLowerCase();
      if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && tag[lowerCaseAttributeKey]) {
        return innermostBaseTag.concat(tag);
      }
    }
  }
  return innermostBaseTag;
}, []);
var warn = (msg) => console && typeof console.warn === "function" && console.warn(msg);
var getTagsFromPropsList = (tagName, primaryAttributes, propsList) => {
  const approvedSeenTags = {};
  return propsList.filter((props) => {
    if (Array.isArray(props[tagName])) {
      return true;
    }
    if (typeof props[tagName] !== "undefined") {
      warn(
        `Helmet: ${tagName} should be of type "Array". Instead found type "${typeof props[tagName]}"`
      );
    }
    return false;
  }).map((props) => props[tagName]).reverse().reduce((approvedTags, instanceTags) => {
    const instanceSeenTags = {};
    instanceTags.filter((tag) => {
      let primaryAttributeKey;
      const keys2 = Object.keys(tag);
      for (let i = 0; i < keys2.length; i += 1) {
        const attributeKey = keys2[i];
        const lowerCaseAttributeKey = attributeKey.toLowerCase();
        if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && !(primaryAttributeKey === "rel" && tag[primaryAttributeKey].toLowerCase() === "canonical") && !(lowerCaseAttributeKey === "rel" && tag[lowerCaseAttributeKey].toLowerCase() === "stylesheet")) {
          primaryAttributeKey = lowerCaseAttributeKey;
        }
        if (primaryAttributes.indexOf(attributeKey) !== -1 && (attributeKey === "innerHTML" || attributeKey === "cssText" || attributeKey === "itemprop")) {
          primaryAttributeKey = attributeKey;
        }
      }
      if (!primaryAttributeKey || !tag[primaryAttributeKey]) {
        return false;
      }
      const value = tag[primaryAttributeKey].toLowerCase();
      if (!approvedSeenTags[primaryAttributeKey]) {
        approvedSeenTags[primaryAttributeKey] = {};
      }
      if (!instanceSeenTags[primaryAttributeKey]) {
        instanceSeenTags[primaryAttributeKey] = {};
      }
      if (!approvedSeenTags[primaryAttributeKey][value]) {
        instanceSeenTags[primaryAttributeKey][value] = true;
        return true;
      }
      return false;
    }).reverse().forEach((tag) => approvedTags.push(tag));
    const keys = Object.keys(instanceSeenTags);
    for (let i = 0; i < keys.length; i += 1) {
      const attributeKey = keys[i];
      const tagUnion = {
        ...approvedSeenTags[attributeKey],
        ...instanceSeenTags[attributeKey]
      };
      approvedSeenTags[attributeKey] = tagUnion;
    }
    return approvedTags;
  }, []).reverse();
};
var getAnyTrueFromPropsList = (propsList, checkedTag) => {
  if (Array.isArray(propsList) && propsList.length) {
    for (let index = 0; index < propsList.length; index += 1) {
      const prop = propsList[index];
      if (prop[checkedTag]) {
        return true;
      }
    }
  }
  return false;
};
var reducePropsToState = (propsList) => ({
  baseTag: getBaseTagFromPropsList([
    "href"
    /* HREF */
  ], propsList),
  bodyAttributes: getAttributesFromPropsList("bodyAttributes", propsList),
  defer: getInnermostProperty(propsList, HELMET_PROPS.DEFER),
  encode: getInnermostProperty(propsList, HELMET_PROPS.ENCODE_SPECIAL_CHARACTERS),
  htmlAttributes: getAttributesFromPropsList("htmlAttributes", propsList),
  linkTags: getTagsFromPropsList(
    "link",
    [
      "rel",
      "href"
      /* HREF */
    ],
    propsList
  ),
  metaTags: getTagsFromPropsList(
    "meta",
    [
      "name",
      "charset",
      "http-equiv",
      "property",
      "itemprop"
      /* ITEM_PROP */
    ],
    propsList
  ),
  noscriptTags: getTagsFromPropsList("noscript", [
    "innerHTML"
    /* INNER_HTML */
  ], propsList),
  onChangeClientState: getOnChangeClientState(propsList),
  scriptTags: getTagsFromPropsList(
    "script",
    [
      "src",
      "innerHTML"
      /* INNER_HTML */
    ],
    propsList
  ),
  styleTags: getTagsFromPropsList("style", [
    "cssText"
    /* CSS_TEXT */
  ], propsList),
  title: getTitleFromPropsList(propsList),
  titleAttributes: getAttributesFromPropsList("titleAttributes", propsList),
  prioritizeSeoTags: getAnyTrueFromPropsList(propsList, HELMET_PROPS.PRIORITIZE_SEO_TAGS)
});
var flattenArray = (possibleArray) => Array.isArray(possibleArray) ? possibleArray.join("") : possibleArray;
var checkIfPropsMatch = (props, toMatch) => {
  const keys = Object.keys(props);
  for (let i = 0; i < keys.length; i += 1) {
    if (toMatch[keys[i]] && toMatch[keys[i]].includes(props[keys[i]])) {
      return true;
    }
  }
  return false;
};
var prioritizer = (elementsList, propsToMatch) => {
  if (Array.isArray(elementsList)) {
    return elementsList.reduce(
      (acc, elementAttrs) => {
        if (checkIfPropsMatch(elementAttrs, propsToMatch)) {
          acc.priority.push(elementAttrs);
        } else {
          acc.default.push(elementAttrs);
        }
        return acc;
      },
      { priority: [], default: [] }
    );
  }
  return { default: elementsList, priority: [] };
};
var without = (obj, key) => {
  return {
    ...obj,
    [key]: void 0
  };
};
var SELF_CLOSING_TAGS = [
  "noscript",
  "script",
  "style"
  /* STYLE */
];
var encodeSpecialCharacters = (str, encode = true) => {
  if (encode === false) {
    return String(str);
  }
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
};
var generateElementAttributesAsString = (attributes) => Object.keys(attributes).reduce((str, key) => {
  const attr = typeof attributes[key] !== "undefined" ? `${key}="${attributes[key]}"` : `${key}`;
  return str ? `${str} ${attr}` : attr;
}, "");
var generateTitleAsString = (type, title, attributes, encode) => {
  const attributeString = generateElementAttributesAsString(attributes);
  const flattenedTitle = flattenArray(title);
  return attributeString ? `<${type} ${HELMET_ATTRIBUTE}="true" ${attributeString}>${encodeSpecialCharacters(
    flattenedTitle,
    encode
  )}</${type}>` : `<${type} ${HELMET_ATTRIBUTE}="true">${encodeSpecialCharacters(
    flattenedTitle,
    encode
  )}</${type}>`;
};
var generateTagsAsString = (type, tags, encode = true) => tags.reduce((str, t) => {
  const tag = t;
  const attributeHtml = Object.keys(tag).filter(
    (attribute) => !(attribute === "innerHTML" || attribute === "cssText")
  ).reduce((string, attribute) => {
    const attr = typeof tag[attribute] === "undefined" ? attribute : `${attribute}="${encodeSpecialCharacters(tag[attribute], encode)}"`;
    return string ? `${string} ${attr}` : attr;
  }, "");
  const tagContent = tag.innerHTML || tag.cssText || "";
  const isSelfClosing = SELF_CLOSING_TAGS.indexOf(type) === -1;
  return `${str}<${type} ${HELMET_ATTRIBUTE}="true" ${attributeHtml}${isSelfClosing ? `/>` : `>${tagContent}</${type}>`}`;
}, "");
var convertElementAttributesToReactProps = (attributes, initProps = {}) => Object.keys(attributes).reduce((obj, key) => {
  const mapped = REACT_TAG_MAP[key];
  obj[mapped || key] = attributes[key];
  return obj;
}, initProps);
var generateTitleAsReactComponent = (_type, title, attributes) => {
  const initProps = {
    key: title,
    [HELMET_ATTRIBUTE]: true
  };
  const props = convertElementAttributesToReactProps(attributes, initProps);
  return [React3.createElement("title", props, title)];
};
var generateTagsAsReactComponent = (type, tags) => tags.map((tag, i) => {
  const mappedTag = {
    key: i,
    [HELMET_ATTRIBUTE]: true
  };
  Object.keys(tag).forEach((attribute) => {
    const mapped = REACT_TAG_MAP[attribute];
    const mappedAttribute = mapped || attribute;
    if (mappedAttribute === "innerHTML" || mappedAttribute === "cssText") {
      const content = tag.innerHTML || tag.cssText;
      mappedTag.dangerouslySetInnerHTML = { __html: content };
    } else {
      mappedTag[mappedAttribute] = tag[attribute];
    }
  });
  return React3.createElement(type, mappedTag);
});
var getMethodsForTag = (type, tags, encode = true) => {
  switch (type) {
    case "title":
      return {
        toComponent: () => generateTitleAsReactComponent(type, tags.title, tags.titleAttributes),
        toString: () => generateTitleAsString(type, tags.title, tags.titleAttributes, encode)
      };
    case "bodyAttributes":
    case "htmlAttributes":
      return {
        toComponent: () => convertElementAttributesToReactProps(tags),
        toString: () => generateElementAttributesAsString(tags)
      };
    default:
      return {
        toComponent: () => generateTagsAsReactComponent(type, tags),
        toString: () => generateTagsAsString(type, tags, encode)
      };
  }
};
var getPriorityMethods = ({ metaTags, linkTags, scriptTags, encode }) => {
  const meta = prioritizer(metaTags, SEO_PRIORITY_TAGS.meta);
  const link = prioritizer(linkTags, SEO_PRIORITY_TAGS.link);
  const script = prioritizer(scriptTags, SEO_PRIORITY_TAGS.script);
  const priorityMethods = {
    toComponent: () => [
      ...generateTagsAsReactComponent("meta", meta.priority),
      ...generateTagsAsReactComponent("link", link.priority),
      ...generateTagsAsReactComponent("script", script.priority)
    ],
    toString: () => (
      // generate all the tags as strings and concatenate them
      `${getMethodsForTag("meta", meta.priority, encode)} ${getMethodsForTag(
        "link",
        link.priority,
        encode
      )} ${getMethodsForTag("script", script.priority, encode)}`
    )
  };
  return {
    priorityMethods,
    metaTags: meta.default,
    linkTags: link.default,
    scriptTags: script.default
  };
};
var mapStateOnServer = (props) => {
  const {
    baseTag,
    bodyAttributes,
    encode = true,
    htmlAttributes,
    noscriptTags,
    styleTags,
    title = "",
    titleAttributes,
    prioritizeSeoTags
  } = props;
  let { linkTags, metaTags, scriptTags } = props;
  let priorityMethods = {
    toComponent: () => {
    },
    toString: () => ""
  };
  if (prioritizeSeoTags) {
    ({ priorityMethods, linkTags, metaTags, scriptTags } = getPriorityMethods(props));
  }
  return {
    priority: priorityMethods,
    base: getMethodsForTag("base", baseTag, encode),
    bodyAttributes: getMethodsForTag("bodyAttributes", bodyAttributes, encode),
    htmlAttributes: getMethodsForTag("htmlAttributes", htmlAttributes, encode),
    link: getMethodsForTag("link", linkTags, encode),
    meta: getMethodsForTag("meta", metaTags, encode),
    noscript: getMethodsForTag("noscript", noscriptTags, encode),
    script: getMethodsForTag("script", scriptTags, encode),
    style: getMethodsForTag("style", styleTags, encode),
    title: getMethodsForTag("title", { title, titleAttributes }, encode)
  };
};
var server_default = mapStateOnServer;
var instances = [];
var isDocument = !!(typeof window !== "undefined" && window.document && window.document.createElement);
var HelmetData = class {
  constructor(context, canUseDOM) {
    __publicField(this, "instances", []);
    __publicField(this, "canUseDOM", isDocument);
    __publicField(this, "context");
    __publicField(this, "value", {
      setHelmet: (serverState) => {
        this.context.helmet = serverState;
      },
      helmetInstances: {
        get: () => this.canUseDOM ? instances : this.instances,
        add: (instance) => {
          (this.canUseDOM ? instances : this.instances).push(instance);
        },
        remove: (instance) => {
          const index = (this.canUseDOM ? instances : this.instances).indexOf(instance);
          (this.canUseDOM ? instances : this.instances).splice(index, 1);
        }
      }
    });
    this.context = context;
    this.canUseDOM = canUseDOM || false;
    if (!canUseDOM) {
      context.helmet = server_default({
        baseTag: [],
        bodyAttributes: {},
        htmlAttributes: {},
        linkTags: [],
        metaTags: [],
        noscriptTags: [],
        scriptTags: [],
        styleTags: [],
        title: "",
        titleAttributes: {}
      });
    }
  }
};
var defaultValue = {};
var Context = React3.createContext(defaultValue);
var HelmetProvider = (_a = class extends Component {
  constructor(props) {
    super(props);
    __publicField(this, "helmetData");
    this.helmetData = new HelmetData(this.props.context || {}, _a.canUseDOM);
  }
  render() {
    return /* @__PURE__ */ React3.createElement(Context.Provider, { value: this.helmetData.value }, this.props.children);
  }
}, __publicField(_a, "canUseDOM", isDocument), _a);
var updateTags = (type, tags) => {
  const headElement = document.head || document.querySelector(
    "head"
    /* HEAD */
  );
  const tagNodes = headElement.querySelectorAll(`${type}[${HELMET_ATTRIBUTE}]`);
  const oldTags = [].slice.call(tagNodes);
  const newTags = [];
  let indexToDelete;
  if (tags && tags.length) {
    tags.forEach((tag) => {
      const newElement = document.createElement(type);
      for (const attribute in tag) {
        if (Object.prototype.hasOwnProperty.call(tag, attribute)) {
          if (attribute === "innerHTML") {
            newElement.innerHTML = tag.innerHTML;
          } else if (attribute === "cssText") {
            if (newElement.styleSheet) {
              newElement.styleSheet.cssText = tag.cssText;
            } else {
              newElement.appendChild(document.createTextNode(tag.cssText));
            }
          } else {
            const attr = attribute;
            const value = typeof tag[attr] === "undefined" ? "" : tag[attr];
            newElement.setAttribute(attribute, value);
          }
        }
      }
      newElement.setAttribute(HELMET_ATTRIBUTE, "true");
      if (oldTags.some((existingTag, index) => {
        indexToDelete = index;
        return newElement.isEqualNode(existingTag);
      })) {
        oldTags.splice(indexToDelete, 1);
      } else {
        newTags.push(newElement);
      }
    });
  }
  oldTags.forEach((tag) => {
    var _a2;
    return (_a2 = tag.parentNode) == null ? void 0 : _a2.removeChild(tag);
  });
  newTags.forEach((tag) => headElement.appendChild(tag));
  return {
    oldTags,
    newTags
  };
};
var updateAttributes = (tagName, attributes) => {
  const elementTag = document.getElementsByTagName(tagName)[0];
  if (!elementTag) {
    return;
  }
  const helmetAttributeString = elementTag.getAttribute(HELMET_ATTRIBUTE);
  const helmetAttributes = helmetAttributeString ? helmetAttributeString.split(",") : [];
  const attributesToRemove = [...helmetAttributes];
  const attributeKeys = Object.keys(attributes);
  for (const attribute of attributeKeys) {
    const value = attributes[attribute] || "";
    if (elementTag.getAttribute(attribute) !== value) {
      elementTag.setAttribute(attribute, value);
    }
    if (helmetAttributes.indexOf(attribute) === -1) {
      helmetAttributes.push(attribute);
    }
    const indexToSave = attributesToRemove.indexOf(attribute);
    if (indexToSave !== -1) {
      attributesToRemove.splice(indexToSave, 1);
    }
  }
  for (let i = attributesToRemove.length - 1; i >= 0; i -= 1) {
    elementTag.removeAttribute(attributesToRemove[i]);
  }
  if (helmetAttributes.length === attributesToRemove.length) {
    elementTag.removeAttribute(HELMET_ATTRIBUTE);
  } else if (elementTag.getAttribute(HELMET_ATTRIBUTE) !== attributeKeys.join(",")) {
    elementTag.setAttribute(HELMET_ATTRIBUTE, attributeKeys.join(","));
  }
};
var updateTitle = (title, attributes) => {
  if (typeof title !== "undefined" && document.title !== title) {
    document.title = flattenArray(title);
  }
  updateAttributes("title", attributes);
};
var commitTagChanges = (newState, cb) => {
  const {
    baseTag,
    bodyAttributes,
    htmlAttributes,
    linkTags,
    metaTags,
    noscriptTags,
    onChangeClientState,
    scriptTags,
    styleTags,
    title,
    titleAttributes
  } = newState;
  updateAttributes("body", bodyAttributes);
  updateAttributes("html", htmlAttributes);
  updateTitle(title, titleAttributes);
  const tagUpdates = {
    baseTag: updateTags("base", baseTag),
    linkTags: updateTags("link", linkTags),
    metaTags: updateTags("meta", metaTags),
    noscriptTags: updateTags("noscript", noscriptTags),
    scriptTags: updateTags("script", scriptTags),
    styleTags: updateTags("style", styleTags)
  };
  const addedTags = {};
  const removedTags = {};
  Object.keys(tagUpdates).forEach((tagType) => {
    const { newTags, oldTags } = tagUpdates[tagType];
    if (newTags.length) {
      addedTags[tagType] = newTags;
    }
    if (oldTags.length) {
      removedTags[tagType] = tagUpdates[tagType].oldTags;
    }
  });
  if (cb) {
    cb();
  }
  onChangeClientState(newState, addedTags, removedTags);
};
var _helmetCallback = null;
var handleStateChangeOnClient = (newState) => {
  if (_helmetCallback) {
    cancelAnimationFrame(_helmetCallback);
  }
  if (newState.defer) {
    _helmetCallback = requestAnimationFrame(() => {
      commitTagChanges(newState, () => {
        _helmetCallback = null;
      });
    });
  } else {
    commitTagChanges(newState);
    _helmetCallback = null;
  }
};
var client_default = handleStateChangeOnClient;
var HelmetDispatcher = class extends Component {
  constructor() {
    super(...arguments);
    __publicField(this, "rendered", false);
  }
  shouldComponentUpdate(nextProps) {
    return !shallowEqual(nextProps, this.props);
  }
  componentDidUpdate() {
    this.emitChange();
  }
  componentWillUnmount() {
    const { helmetInstances } = this.props.context;
    helmetInstances.remove(this);
    this.emitChange();
  }
  emitChange() {
    const { helmetInstances, setHelmet } = this.props.context;
    let serverState = null;
    const state = reducePropsToState(
      helmetInstances.get().map((instance) => {
        const props = { ...instance.props };
        delete props.context;
        return props;
      })
    );
    if (HelmetProvider.canUseDOM) {
      client_default(state);
    } else if (server_default) {
      serverState = server_default(state);
    }
    setHelmet(serverState);
  }
  // componentWillMount will be deprecated
  // for SSR, initialize on first render
  // constructor is also unsafe in StrictMode
  init() {
    if (this.rendered) {
      return;
    }
    this.rendered = true;
    const { helmetInstances } = this.props.context;
    helmetInstances.add(this);
    this.emitChange();
  }
  render() {
    this.init();
    return null;
  }
};
var Helmet = (_b = class extends Component {
  shouldComponentUpdate(nextProps) {
    return !fastCompare(without(this.props, "helmetData"), without(nextProps, "helmetData"));
  }
  mapNestedChildrenToProps(child, nestedChildren) {
    if (!nestedChildren) {
      return null;
    }
    switch (child.type) {
      case "script":
      case "noscript":
        return {
          innerHTML: nestedChildren
        };
      case "style":
        return {
          cssText: nestedChildren
        };
      default:
        throw new Error(
          `<${child.type} /> elements are self-closing and can not contain children. Refer to our API for more information.`
        );
    }
  }
  flattenArrayTypeChildren(child, arrayTypeChildren, newChildProps, nestedChildren) {
    return {
      ...arrayTypeChildren,
      [child.type]: [
        ...arrayTypeChildren[child.type] || [],
        {
          ...newChildProps,
          ...this.mapNestedChildrenToProps(child, nestedChildren)
        }
      ]
    };
  }
  mapObjectTypeChildren(child, newProps, newChildProps, nestedChildren) {
    switch (child.type) {
      case "title":
        return {
          ...newProps,
          [child.type]: nestedChildren,
          titleAttributes: { ...newChildProps }
        };
      case "body":
        return {
          ...newProps,
          bodyAttributes: { ...newChildProps }
        };
      case "html":
        return {
          ...newProps,
          htmlAttributes: { ...newChildProps }
        };
      default:
        return {
          ...newProps,
          [child.type]: { ...newChildProps }
        };
    }
  }
  mapArrayTypeChildrenToProps(arrayTypeChildren, newProps) {
    let newFlattenedProps = { ...newProps };
    Object.keys(arrayTypeChildren).forEach((arrayChildName) => {
      newFlattenedProps = {
        ...newFlattenedProps,
        [arrayChildName]: arrayTypeChildren[arrayChildName]
      };
    });
    return newFlattenedProps;
  }
  warnOnInvalidChildren(child, nestedChildren) {
    invariant(
      VALID_TAG_NAMES.some((name) => child.type === name),
      typeof child.type === "function" ? `You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.` : `Only elements types ${VALID_TAG_NAMES.join(
        ", "
      )} are allowed. Helmet does not support rendering <${child.type}> elements. Refer to our API for more information.`
    );
    invariant(
      !nestedChildren || typeof nestedChildren === "string" || Array.isArray(nestedChildren) && !nestedChildren.some((nestedChild) => typeof nestedChild !== "string"),
      `Helmet expects a string as a child of <${child.type}>. Did you forget to wrap your children in braces? ( <${child.type}>{\`\`}</${child.type}> ) Refer to our API for more information.`
    );
    return true;
  }
  mapChildrenToProps(children, newProps) {
    let arrayTypeChildren = {};
    React3.Children.forEach(children, (child) => {
      if (!child || !child.props) {
        return;
      }
      const { children: nestedChildren, ...childProps } = child.props;
      const newChildProps = Object.keys(childProps).reduce((obj, key) => {
        obj[HTML_TAG_MAP[key] || key] = childProps[key];
        return obj;
      }, {});
      let { type } = child;
      if (typeof type === "symbol") {
        type = type.toString();
      } else {
        this.warnOnInvalidChildren(child, nestedChildren);
      }
      switch (type) {
        case "Symbol(react.fragment)":
          newProps = this.mapChildrenToProps(nestedChildren, newProps);
          break;
        case "link":
        case "meta":
        case "noscript":
        case "script":
        case "style":
          arrayTypeChildren = this.flattenArrayTypeChildren(
            child,
            arrayTypeChildren,
            newChildProps,
            nestedChildren
          );
          break;
        default:
          newProps = this.mapObjectTypeChildren(child, newProps, newChildProps, nestedChildren);
          break;
      }
    });
    return this.mapArrayTypeChildrenToProps(arrayTypeChildren, newProps);
  }
  render() {
    const { children, ...props } = this.props;
    let newProps = { ...props };
    let { helmetData } = props;
    if (children) {
      newProps = this.mapChildrenToProps(children, newProps);
    }
    if (helmetData && !(helmetData instanceof HelmetData)) {
      const data = helmetData;
      helmetData = new HelmetData(data.context, true);
      delete newProps.helmetData;
    }
    return helmetData ? /* @__PURE__ */ React3.createElement(HelmetDispatcher, { ...newProps, context: helmetData.value }) : /* @__PURE__ */ React3.createElement(Context.Consumer, null, (context) => /* @__PURE__ */ React3.createElement(HelmetDispatcher, { ...newProps, context }));
  }
}, __publicField(_b, "defaultProps", {
  defer: true,
  encodeSpecialCharacters: true,
  prioritizeSeoTags: false
}), _b);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Icon$1 = forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => {
    return createElement(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: mergeClasses("lucide", className),
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => createElement(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const createLucideIcon = (iconName, iconNode) => {
  const Component2 = forwardRef(
    ({ className, ...props }, ref) => createElement(Icon$1, {
      ref,
      iconNode,
      className: mergeClasses(`lucide-${toKebabCase(iconName)}`, className),
      ...props
    })
  );
  Component2.displayName = `${iconName}`;
  return Component2;
};
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowRight = createLucideIcon("ArrowRight", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowUpRight = createLucideIcon("ArrowUpRight", [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BadgePercent = createLucideIcon("BadgePercent", [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
      key: "3c2336"
    }
  ],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "M9 9h.01", key: "1q5me6" }],
  ["path", { d: "M15 15h.01", key: "lqbp3k" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BedDouble = createLucideIcon("BedDouble", [
  ["path", { d: "M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8", key: "1k78r4" }],
  ["path", { d: "M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4", key: "fb3tl2" }],
  ["path", { d: "M12 4v6", key: "1dcgq2" }],
  ["path", { d: "M2 18h20", key: "ajqnye" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Briefcase = createLucideIcon("Briefcase", [
  ["path", { d: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16", key: "jecpp" }],
  ["rect", { width: "20", height: "14", x: "2", y: "6", rx: "2", key: "i6l2r4" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bus = createLucideIcon("Bus", [
  ["path", { d: "M8 6v6", key: "18i7km" }],
  ["path", { d: "M15 6v6", key: "1sg6z9" }],
  ["path", { d: "M2 12h19.6", key: "de5uta" }],
  [
    "path",
    {
      d: "M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3",
      key: "1wwztk"
    }
  ],
  ["circle", { cx: "7", cy: "18", r: "2", key: "19iecd" }],
  ["path", { d: "M9 18h5", key: "lrx6i" }],
  ["circle", { cx: "16", cy: "18", r: "2", key: "1v4tcr" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CalendarDays = createLucideIcon("CalendarDays", [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Car = createLucideIcon("Car", [
  [
    "path",
    {
      d: "M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",
      key: "5owen"
    }
  ],
  ["circle", { cx: "7", cy: "17", r: "2", key: "u2ysq9" }],
  ["path", { d: "M9 17h6", key: "r8uit2" }],
  ["circle", { cx: "17", cy: "17", r: "2", key: "axvx0g" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Check = createLucideIcon("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronDown = createLucideIcon("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronLeft = createLucideIcon("ChevronLeft", [
  ["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronRight = createLucideIcon("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Clock = createLucideIcon("Clock", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Earth = createLucideIcon("Earth", [
  ["path", { d: "M21.54 15H17a2 2 0 0 0-2 2v4.54", key: "1djwo0" }],
  [
    "path",
    {
      d: "M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17",
      key: "1tzkfa"
    }
  ],
  ["path", { d: "M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05", key: "14pb5j" }],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Facebook = createLucideIcon("Facebook", [
  [
    "path",
    { d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z", key: "1jg4f8" }
  ]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const House = createLucideIcon("House", [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Instagram = createLucideIcon("Instagram", [
  ["rect", { width: "20", height: "20", x: "2", y: "2", rx: "5", ry: "5", key: "2e1cvw" }],
  ["path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z", key: "9exkf1" }],
  ["line", { x1: "17.5", x2: "17.51", y1: "6.5", y2: "6.5", key: "r4j83e" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mail = createLucideIcon("Mail", [
  ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2", key: "18n3k1" }],
  ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7", key: "1ocrg3" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MapPin = createLucideIcon("MapPin", [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Menu = createLucideIcon("Menu", [
  ["line", { x1: "4", x2: "20", y1: "12", y2: "12", key: "1e0a9i" }],
  ["line", { x1: "4", x2: "20", y1: "6", y2: "6", key: "1owob3" }],
  ["line", { x1: "4", x2: "20", y1: "18", y2: "18", key: "yk5zj1" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageCircle = createLucideIcon("MessageCircle", [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z", key: "vv11sd" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MoonStar = createLucideIcon("MoonStar", [
  ["path", { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9", key: "4ay0iu" }],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Moon = createLucideIcon("Moon", [
  ["path", { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z", key: "a7tn18" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mountain = createLucideIcon("Mountain", [
  ["path", { d: "m8 3 4 8 5-5 5 15H2L8 3z", key: "otkl63" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Package = createLucideIcon("Package", [
  [
    "path",
    {
      d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
      key: "1a0edw"
    }
  ],
  ["path", { d: "M12 22V12", key: "d0xqtd" }],
  ["path", { d: "m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7", key: "yx3hmr" }],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Phone = createLucideIcon("Phone", [
  [
    "path",
    {
      d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
      key: "foiqr5"
    }
  ]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PlaneLanding = createLucideIcon("PlaneLanding", [
  ["path", { d: "M2 22h20", key: "272qi7" }],
  [
    "path",
    {
      d: "M3.77 10.77 2 9l2-4.5 1.1.55c.55.28.9.84.9 1.45s.35 1.17.9 1.45L8 8.5l3-6 1.05.53a2 2 0 0 1 1.09 1.52l.72 5.4a2 2 0 0 0 1.09 1.52l4.4 2.2c.42.22.78.55 1.01.96l.6 1.03c.49.88-.06 1.98-1.06 2.1l-1.18.15c-.47.06-.95-.02-1.37-.24L4.29 11.15a2 2 0 0 1-.52-.38Z",
      key: "1ma21e"
    }
  ]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Plane = createLucideIcon("Plane", [
  [
    "path",
    {
      d: "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",
      key: "1v9wt8"
    }
  ]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Quote$1 = createLucideIcon("Quote", [
  [
    "path",
    {
      d: "M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
      key: "rib7q0"
    }
  ],
  [
    "path",
    {
      d: "M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
      key: "1ymkrd"
    }
  ]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Search = createLucideIcon("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Send = createLucideIcon("Send", [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShieldCheck = createLucideIcon("ShieldCheck", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sparkles = createLucideIcon("Sparkles", [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Stamp = createLucideIcon("Stamp", [
  ["path", { d: "M5 22h14", key: "ehvnwv" }],
  [
    "path",
    {
      d: "M19.27 13.73A2.5 2.5 0 0 0 17.5 13h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5c0-.66-.26-1.3-.73-1.77Z",
      key: "1sy9ra"
    }
  ],
  [
    "path",
    { d: "M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-3-3c-1.66 0-3 1-3 3s1 2 1 3.5V13", key: "cnxgux" }
  ]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Star = createLucideIcon("Star", [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sun = createLucideIcon("Sun", [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Users = createLucideIcon("Users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["path", { d: "M16 3.13a4 4 0 0 1 0 7.75", key: "1da9ce" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wallet = createLucideIcon("Wallet", [
  [
    "path",
    {
      d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
      key: "18etb6"
    }
  ],
  ["path", { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4", key: "xoc0q4" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const X = createLucideIcon("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Youtube = createLucideIcon("Youtube", [
  [
    "path",
    {
      d: "M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",
      key: "1q2vi4"
    }
  ],
  ["path", { d: "m10 15 5-3-5-3z", key: "1jp15x" }]
]);
const MAP = {
  Plane,
  Moon,
  Mountain,
  Stamp,
  BedDouble,
  Car,
  PlaneLanding,
  Bus,
  Briefcase,
  Package,
  ShieldCheck,
  Wallet,
  MessageCircle,
  Users,
  BadgePercent,
  Globe2: Earth,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Sun,
  MoonStar,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Search,
  CalendarDays,
  Check,
  Quote: Quote$1,
  Sparkles,
  Send,
  Facebook,
  Instagram,
  Youtube,
  Home: House
};
function Icon({ name, size = 20, ...rest }) {
  const C = MAP[name] || Sparkles;
  return /* @__PURE__ */ jsx(C, { size, strokeWidth: 1.75, "aria-hidden": "true", focusable: "false", ...rest });
}
function WhatsAppIcon({ size = 20 }) {
  return /* @__PURE__ */ jsx("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.2-.6-.4zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2c2.6 0 5.1 1 6.9 2.9 1.8 1.8 2.9 4.3 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8zm8.4-18.2C18.2 1.3 15.2 0 12 0 5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.8 1 3.8 1.5 5.8 1.5 6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.6-8.3z" }) });
}
function Logo() {
  return /* @__PURE__ */ jsxs("span", { className: "logo", children: [
    /* @__PURE__ */ jsxs("svg", { className: "logo__mark", viewBox: "0 0 40 40", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("rect", { width: "40", height: "40", rx: "11", fill: "currentColor", className: "logo__bg" }),
      /* @__PURE__ */ jsx("path", { d: "M8 28c7-1.4 12.6-7 15.4-15.4l4.2 2.8C24.8 23.8 17.8 30.8 8 32z", fill: "#F5A524" }),
      /* @__PURE__ */ jsx("circle", { cx: "29", cy: "11", r: "3.5", fill: "#3DD6B5" })
    ] }),
    /* @__PURE__ */ jsxs("span", { className: "logo__text", children: [
      /* @__PURE__ */ jsx("span", { className: "logo__name", children: "Baba Travels" }),
      /* @__PURE__ */ jsx("span", { className: "logo__sub", children: "& Tours" })
    ] })
  ] });
}
const SITE = {
  name: "Baba Travels & Tours",
  shortName: "Baba Travels",
  url: "https://www.babatravels.pk",
  // CONFIRM production domain
  tagline: "Flights, Umrah & tours — planned in Pakistan, trusted worldwide",
  description: "Baba Travels & Tours is a Pakistan-based travel agency for air tickets, Umrah and Hajj packages, northern-area and international tours, visa assistance, hotels, car rental and airport transfers.",
  phone: "+92 300 0000000",
  // CONFIRM
  phoneHref: "+923000000000",
  // CONFIRM
  whatsapp: "923000000000",
  // CONFIRM (international format, no +)
  email: "info@babatravels.pk",
  // CONFIRM
  founded: 2010,
  // CONFIRM
  hours: "Mon–Sat 9:00–21:00 PKT · WhatsApp 24/7",
  // CONFIRM
  social: {
    facebook: "https://facebook.com/",
    // CONFIRM
    instagram: "https://instagram.com/",
    // CONFIRM
    youtube: "https://youtube.com/",
    // CONFIRM
    tiktok: "https://tiktok.com/"
    // CONFIRM
  },
  rating: { value: 4.9, count: 1280 }
  // CONFIRM from Google reviews
};
const OFFICES = [
  // CONFIRM all addresses / phones / geo
  { id: "karachi", city: "Karachi", country: "Pakistan", label: "Head office", address: "Office 12, Shahrah-e-Faisal, Karachi 75400", phone: "+92 21 0000 0000", hours: "Mon–Sat 9:00–21:00", geo: [24.8607, 67.0011] },
  { id: "lahore", city: "Lahore", country: "Pakistan", label: "Branch", address: "Main Boulevard, Gulberg III, Lahore 54660", phone: "+92 42 0000 0000", hours: "Mon–Sat 10:00–20:00", geo: [31.5204, 74.3587] },
  { id: "islamabad", city: "Islamabad", country: "Pakistan", label: "Branch", address: "Blue Area, Jinnah Avenue, Islamabad 44000", phone: "+92 51 0000 0000", hours: "Mon–Sat 10:00–20:00", geo: [33.6844, 73.0479] },
  { id: "dubai", city: "Dubai", country: "UAE", label: "Partner desk", address: "Al Karama, Dubai, UAE", phone: "+971 4 000 0000", hours: "Sun–Fri 10:00–19:00", geo: [25.2048, 55.2708] }
];
const img = (name) => ({
  d1920: `images/hero/${name}-1920.webp`,
  d1280: `images/hero/${name}-1280.webp`,
  mobile: `images/hero/${name}-m.webp`,
  thumb: `images/hero/${name}-thumb.webp`
});
const HERO_SLIDES = [
  { id: "hunza", place: "Hunza Valley · Gilgit-Baltistan", title: "Wake up beside the mountains of the north", from: "PKR 54,900", meta: "6 days · Northern tours", to: "/destinations/hunza-valley", img: img("hunza"), alt: "Golden-hour light over snow-capped peaks and a calm lake in Hunza Valley" },
  { id: "umrah", place: "Makkah & Madinah", title: "Umrah, arranged with care from start to finish", from: "PKR 289,000", meta: "14 & 21 nights · Umrah", to: "/services/umrah-hajj-packages", img: img("umrah"), alt: "The Kaaba at night in the Grand Mosque of Makkah, ringed by worshippers beneath lit minarets" },
  { id: "dubai", place: "Dubai · United Arab Emirates", title: "City lights, desert sunsets, one easy visa", from: "PKR 119,000", meta: "4 nights · Visa + hotel", to: "/destinations/dubai", img: img("dubai"), alt: "Downtown Dubai skyline at dusk, the Burj Khalifa rising above highway light trails" },
  { id: "skies", place: "60+ countries · Air tickets", title: "Every airline, every route, one fair fare", from: "PKR 38,500", meta: "Domestic & international", to: "/services/air-tickets", img: img("skies"), alt: "Passenger jet flying above golden sunrise clouds" },
  { id: "islands", place: "Maldives · Bali · Langkawi", title: "Turquoise water, honeymoon quiet", from: "PKR 245,000", meta: "5 nights · Holidays", to: "/destinations/maldives", img: img("islands"), alt: "A calm beach and sea glowing at golden sunset" }
];
const SERVICES$1 = [
  {
    slug: "air-tickets",
    icon: "Plane",
    title: "Air tickets",
    short: "Domestic & international fares on every major airline, with 24/7 rebooking help.",
    summary: "Baba Travels books domestic and international air tickets from Pakistan on PIA, Emirates, Qatar Airways, Saudia, Turkish Airlines and 40+ other carriers. We compare fares across airlines, hold seats while you decide, and handle date changes, refunds and baggage add-ons on WhatsApp, 24 hours a day.",
    facts: [["Coverage", "60+ countries, all Pakistani airports"], ["Airlines", "PIA, Emirates, Qatar, Saudia, Turkish + 40 more"], ["Booking time", "E-ticket in 15–30 minutes"], ["Price from", "PKR 38,500 return (KHI–DXB)"], ["Payment", "Bank transfer, card, JazzCash, Easypaisa"], ["Support", "24/7 WhatsApp for changes"]],
    includes: ["Fare comparison across 40+ airlines", "Seat hold while you confirm", "Group & student fares", "Date change and refund handling", "Extra baggage and meal requests"]
  },
  {
    slug: "umrah-hajj-packages",
    icon: "Moon",
    title: "Umrah & Hajj packages",
    short: "Visa, flights, Haram-close hotels and ziyarat — one package, one team.",
    summary: "Our Umrah packages from Pakistan include the Umrah visa, return flights, hotels in Makkah and Madinah at your chosen distance from the Haram, airport and intercity transport, and guided ziyarat. Packages run 7 to 28 nights, start from PKR 289,000 per person, and can be customised for families.",
    facts: [["Duration", "7, 14, 21 or 28 nights"], ["Hotels", "3★ to 5★, 150 m – 1 km from Haram"], ["Includes", "Visa, flights, hotels, transport, ziyarat"], ["Price from", "PKR 289,000 per person (sharing)"], ["Departures", "Karachi, Lahore, Islamabad, Multan, Peshawar"], ["Support", "Saudi-side helpline 24/7"]],
    includes: ["Umrah visa processing", "Return flights from 5 Pakistani cities", "Makkah & Madinah hotels", "Private or shared transport", "Ziyarat with guide", "Pre-departure briefing"]
  },
  {
    slug: "holiday-tour-packages",
    icon: "Mountain",
    title: "Holiday tour packages",
    short: "Northern Pakistan and international holidays, from budget to luxury.",
    summary: "We plan guided holiday packages to Hunza, Skardu, Swat, Naran-Kaghan and Neelum Valley, plus international trips to Dubai, Turkey, Malaysia, Thailand, Azerbaijan and the Maldives. Each package bundles transport, hotels, meals and a local guide, with fixed departures every week and private family tours on request.",
    facts: [["Domestic", "Hunza, Skardu, Swat, Naran, Neelum"], ["International", "Dubai, Turkey, Malaysia, Thailand, Baku, Maldives"], ["Duration", "3 to 12 days"], ["Price from", "PKR 29,900 per person"], ["Group size", "Private or 8–20 traveller groups"], ["Best season", "Apr–Oct (north), all year (abroad)"]],
    includes: ["Hotels & meals", "AC coaster or private car", "Local guide", "Sightseeing entry tickets", "Travel insurance on request"]
  },
  {
    slug: "visa-assistance",
    icon: "Stamp",
    title: "Visa assistance",
    short: "Document checklists, appointments and filing for 40+ countries.",
    summary: "Our visa team prepares and files tourist, visit and business visa applications for UAE, Saudi Arabia, Turkey, UK, Schengen, Malaysia, Thailand and 30+ more countries. We give you a document checklist, book biometrics appointments, draft cover letters and track your file until the passport is back.",
    facts: [["Countries", "40+ destinations"], ["Visa types", "Tourist, visit, business, Umrah"], ["UAE visa time", "3–5 working days"], ["Service fee from", "PKR 4,500"], ["Approval rate", "High, with complete files"], ["Tracking", "WhatsApp updates at each step"]],
    includes: ["Eligibility check", "Personal document checklist", "Appointment booking", "Cover letter & itinerary", "Hotel & flight reservations for file"]
  },
  {
    slug: "hotel-booking",
    icon: "BedDouble",
    title: "Hotel booking",
    short: "Negotiated rates in Pakistan, the Gulf and beyond.",
    summary: "We book hotels across Pakistan and abroad at negotiated rates, from budget guest houses in Hunza to 5-star stays in Dubai and Istanbul. Rooms are confirmed in writing, and we can pay in PKR on your behalf, which avoids card fees and exchange surprises.",
    facts: [["Properties", "25,000+ worldwide"], ["Pay in", "PKR"], ["Confirmation", "Written voucher in 1 hour"], ["Price from", "PKR 6,500 / night"], ["Free changes", "On flexible rates"], ["Support", "24/7"]],
    includes: ["Negotiated rates", "Room-type advice", "Early check-in requests", "Group blocks"]
  },
  {
    slug: "car-rental",
    icon: "Car",
    title: "Car rental & chauffeur",
    short: "Sedans, SUVs and coasters with experienced drivers.",
    summary: "Rent a car with driver in Karachi, Lahore, Islamabad and for northern tours. Choose from sedans, Prado and Land Cruiser SUVs, Grand Cabin vans and 22-seat coasters. Prices include the driver and fuel within city limits; outstation tours are quoted per day.",
    facts: [["Cities", "Karachi, Lahore, Islamabad + north"], ["Fleet", "Sedan, SUV, Grand Cabin, Coaster"], ["Price from", "PKR 9,500 / day with driver"], ["Booking", "Same day"], ["Drivers", "Vetted, tour-experienced"]],
    includes: ["Professional driver", "Fuel within city", "Toll & parking (outstation quoted)", "Clean, insured vehicles"]
  },
  {
    slug: "airport-transfers",
    icon: "PlaneLanding",
    title: "Airport transfers",
    short: "Meet-and-greet pickups at KHI, LHE, ISB, JED, MED and DXB.",
    summary: "Our drivers meet you in arrivals with a name board and track your flight, so a delay never leaves you waiting. Transfers run 24/7 at Karachi, Lahore and Islamabad airports, and at Jeddah, Madinah and Dubai for our Umrah and holiday travellers.",
    facts: [["Airports", "KHI, LHE, ISB, JED, MED, DXB"], ["Availability", "24/7"], ["Price from", "PKR 4,500 one way"], ["Flight tracking", "Included"], ["Free waiting", "60 minutes"]],
    includes: ["Name-board meet & greet", "Flight tracking", "Luggage help", "Child seats on request"]
  },
  {
    slug: "intercity-coach-booking",
    icon: "Bus",
    title: "Intercity coach booking",
    short: "Seats on premium coaches between 30+ Pakistani cities.",
    summary: "Book seats on premium intercity coaches between Karachi, Lahore, Islamabad, Multan, Peshawar, Faisalabad and 25+ other cities. We confirm your seat, share boarding details on WhatsApp, and can add a pickup to the terminal.",
    facts: [["Routes", "30+ cities"], ["Classes", "Executive, business, sleeper"], ["Price from", "PKR 2,800"], ["Confirmation", "Instant on WhatsApp"]],
    includes: ["Seat selection", "Terminal pickup add-on", "Group bookings"]
  },
  {
    slug: "corporate-travel",
    icon: "Briefcase",
    title: "Corporate travel",
    short: "Monthly invoicing, policy control and a dedicated travel desk.",
    summary: "Baba Travels runs travel for companies with a dedicated account manager, monthly invoicing, approval workflows and negotiated airline and hotel rates. We handle conferences, team trips and executive travel, and send a monthly spend report for finance.",
    facts: [["Billing", "Monthly credit invoicing"], ["Desk", "Dedicated account manager"], ["Reports", "Monthly spend report"], ["Setup time", "2 working days"]],
    includes: ["Policy-based booking", "Negotiated rates", "MICE & conferences", "Visa desk for staff"]
  },
  {
    slug: "cargo-courier",
    icon: "Package",
    title: "Cargo & courier",
    short: "Send parcels and excess baggage between Pakistan and the Gulf, UK & beyond.",
    summary: "Send documents, parcels and unaccompanied baggage between Pakistan and the UAE, Saudi Arabia, the UK, Canada and the US. We collect from your door, handle customs paperwork and share tracking updates until delivery.",
    facts: [["Lanes", "PK ↔ UAE, KSA, UK, CA, US"], ["Transit", "3–10 working days"], ["Price from", "PKR 2,200 / kg"], ["Pickup", "Door collection in major cities"]],
    includes: ["Door pickup", "Customs paperwork", "Tracking updates", "Packing on request"]
  }
];
const PACKAGES = [
  { id: "umrah-economy", cat: "Umrah", title: "Economy Umrah", nights: "14 nights", hotel: "3★ · 800 m from Haram", price: "PKR 289,000", badge: null, perks: ["Visa + return flights", "Shared transport", "Ziyarat Makkah & Madinah"] },
  { id: "umrah-standard", cat: "Umrah", title: "Family Umrah", nights: "21 nights", hotel: "4★ · 400 m from Haram", price: "PKR 365,000", badge: "Most booked", perks: ["Visa + direct flights", "Private family transport", "Guided ziyarat + briefing"] },
  { id: "umrah-premium", cat: "Umrah", title: "Premium Umrah", nights: "14 nights", hotel: "5★ · Haram-facing", price: "PKR 540,000", badge: "Premium", perks: ["Visa + business-class option", "GMC private transport", "Dedicated Saudi-side host"] },
  { id: "hunza-6d", cat: "Northern Pakistan", title: "Hunza & Khunjerab", nights: "6 days", hotel: "Hotels + breakfast & dinner", price: "PKR 54,900", badge: "Weekly departures", perks: ["Attabad Lake & Passu Cones", "Khunjerab Pass (China border)", "AC coaster from Islamabad"] },
  { id: "skardu-7d", cat: "Northern Pakistan", title: "Skardu & Deosai", nights: "7 days", hotel: "Hotels + meals", price: "PKR 69,500", badge: null, perks: ["Shangrila & Upper Kachura", "Deosai Plains jeep safari", "Flights or road option"] },
  { id: "dubai-4n", cat: "International", title: "Dubai Getaway", nights: "4 nights", hotel: "4★ · Downtown/Deira", price: "PKR 119,000", badge: "Visa included", perks: ["UAE visit visa", "Desert safari + dhow cruise", "Airport transfers"] },
  { id: "turkey-7n", cat: "International", title: "Istanbul & Cappadocia", nights: "7 nights", hotel: "4★ hotels", price: "PKR 315,000", badge: null, perks: ["Bosphorus cruise", "Cappadocia balloon option", "Domestic flight included"] },
  { id: "maldives-5n", cat: "International", title: "Maldives Honeymoon", nights: "5 nights", hotel: "Water villa option", price: "PKR 245,000", badge: "Honeymoon", perks: ["Speedboat transfers", "Half board", "Sunset cruise"] }
];
const DESTINATIONS = [
  {
    slug: "hunza-valley",
    name: "Hunza Valley",
    region: "Gilgit-Baltistan, Pakistan",
    img: "hunza",
    from: "PKR 54,900",
    days: "5–7 days",
    summary: "A Hunza Valley tour from Islamabad takes 5 to 7 days by road along the Karakoram Highway, or 4 days if you fly to Gilgit. Packages from PKR 54,900 per person include hotels, meals, an AC coaster and a guide, and cover Karimabad, Attabad Lake, Passu Cones and the Khunjerab Pass. The best time to visit is April to October.",
    best: "April–October (blossoms in April, autumn colour in late October)",
    reach: "Road from Islamabad via KKH (~16 h over 2 days) or flight to Gilgit + 2 h drive",
    highlights: ["Baltit & Altit Forts", "Attabad Lake boating", "Passu Cones & suspension bridge", "Khunjerab Pass at 4,693 m", "Eagle’s Nest sunset"],
    itinerary: ["Islamabad → Naran or Chilas", "Drive to Hunza via Karakoram Highway", "Karimabad: Baltit & Altit Forts, Eagle’s Nest", "Attabad Lake, Passu, Khunjerab Pass", "Hunza → Chilas / Besham", "Return to Islamabad"],
    nearby: ["skardu", "swat"]
  },
  {
    slug: "skardu",
    name: "Skardu",
    region: "Gilgit-Baltistan, Pakistan",
    img: "hunza",
    tone: { objectPosition: "18% 50%", filter: "hue-rotate(-28deg) saturate(1.15)" },
    from: "PKR 69,500",
    days: "6–8 days",
    summary: "Skardu is the gateway to Deosai, Shangrila and the Karakoram, reachable by a 1-hour flight from Islamabad or two days by road. A 7-day Skardu package from PKR 69,500 includes hotels, meals and a jeep safari to the Deosai Plains, open June to September.",
    best: "May–October (Deosai open June–September)",
    reach: "1-hour flight from Islamabad, or 2 days by road via KKH",
    highlights: ["Shangrila Resort", "Upper Kachura Lake", "Deosai Plains", "Cold Desert at Katpana", "Manthokha Waterfall"],
    itinerary: ["Fly Islamabad → Skardu", "Shangrila & Upper Kachura", "Deosai Plains jeep safari", "Shigar Fort & Cold Desert", "Khaplu Palace", "Return flight"],
    nearby: ["hunza-valley", "swat"]
  },
  {
    slug: "swat",
    name: "Swat & Kalam",
    region: "Khyber Pakhtunkhwa, Pakistan",
    img: "hunza",
    tone: { objectPosition: "88% 50%", filter: "hue-rotate(75deg) saturate(.9)" },
    from: "PKR 29,900",
    days: "3–4 days",
    summary: "A Swat and Kalam tour runs 3 to 4 days from Islamabad or Lahore, covering Malam Jabba, Mingora, Kalam and Mahodand Lake. Packages start at PKR 29,900 per person with hotel, meals and transport, and are ideal for families and first-time visitors to the north.",
    best: "April–October; Malam Jabba for snow in December–February",
    reach: "5–6 hours by road from Islamabad via Swat Motorway",
    highlights: ["Malam Jabba chairlift", "Kalam valley", "Mahodand Lake", "Ushu Forest"],
    itinerary: ["Islamabad → Swat via motorway", "Malam Jabba", "Kalam & Ushu Forest", "Mahodand Lake → return"],
    nearby: ["hunza-valley", "skardu"]
  },
  {
    slug: "dubai",
    name: "Dubai",
    region: "United Arab Emirates",
    img: "dubai",
    from: "PKR 119,000",
    days: "4–5 nights",
    summary: "A Dubai holiday package from Pakistan costs from PKR 119,000 per person for 4 nights and includes the UAE visit visa, return flights from Karachi, Lahore or Islamabad, a 4-star hotel, desert safari and dhow cruise. Visas are usually processed in 3 to 5 working days.",
    best: "November–March for pleasant weather",
    reach: "2–3.5 hour direct flights from all major Pakistani airports",
    highlights: ["Burj Khalifa observation deck", "Desert safari", "Dhow cruise dinner", "Dubai Mall & Old Souk"],
    itinerary: ["Arrival & transfer", "City tour + Burj Khalifa", "Desert safari", "Free day / Abu Dhabi option", "Departure"],
    nearby: ["maldives", "hunza-valley"]
  },
  {
    slug: "maldives",
    name: "Maldives",
    region: "Indian Ocean",
    img: "islands",
    from: "PKR 245,000",
    days: "4–6 nights",
    summary: "A Maldives honeymoon package from Pakistan starts at PKR 245,000 per person for 5 nights, with flights via Dubai or Colombo, a beach or water villa, half-board meals and speedboat transfers. Pakistani passport holders receive a free 30-day visa on arrival.",
    best: "November–April (dry season)",
    reach: "1 stop via Dubai, Doha or Colombo, ~8–10 hours",
    highlights: ["Water villa stay", "Snorkelling house reefs", "Sunset dolphin cruise", "Sandbank picnic"],
    itinerary: ["Arrive Malé + speedboat", "Resort & reef snorkelling", "Sunset cruise", "Sandbank picnic", "Departure"],
    nearby: ["dubai", "skardu"]
  }
];
const STEPS$1 = [
  { title: "Tell us your plan", text: "Share dates, budget and travellers through the form or WhatsApp — it takes two minutes." },
  { title: "Get options in 30 minutes", text: "A travel advisor sends 2–3 clear options with total prices in PKR, no hidden fees." },
  { title: "Confirm & pay securely", text: "Pay by bank transfer, card or mobile wallet. Tickets and vouchers arrive on WhatsApp and email." },
  { title: "Travel with backup", text: "A real person answers 24/7 on WhatsApp while you travel, from flight delays to hotel changes." }
];
const STATS = [
  // CONFIRM all figures with client
  { value: 15, suffix: "+", label: "Years in travel" },
  { value: 48e3, suffix: "+", label: "Travellers served" },
  { value: 60, suffix: "+", label: "Countries covered" },
  { value: 4.9, suffix: "★", label: "Average rating", decimals: 1 }
];
const WHY = [
  { icon: "ShieldCheck", title: "Licensed & accountable", text: "Registered with the Department of Tourist Services and IATA-accredited ticketing. (CONFIRM licence numbers)" },
  { icon: "Wallet", title: "Clear PKR pricing", text: "Every quote shows the full price in rupees — taxes, visa and transfers included." },
  { icon: "MessageCircle", title: "Humans on WhatsApp, 24/7", text: "Message us at 3 a.m. from Jeddah airport and a real advisor replies." },
  { icon: "Users", title: "Family-first planning", text: "Wheelchair help, elderly-friendly hotels and mahram-aware Umrah groups." },
  { icon: "BadgePercent", title: "Negotiated rates", text: "Direct contracts with airlines and hotels mean better fares than DIY booking." },
  { icon: "Globe2", title: "Local here, local there", text: "Partner desks in Dubai, Jeddah and Istanbul handle problems on the ground." }
];
const TESTIMONIALS = [
  // CONFIRM: replace with real, consented reviews
  { name: "Ayesha R.", city: "Karachi", trip: "Family Umrah, 21 nights", rating: 5, text: "They handled my parents’ wheelchair assistance at both airports and the hotel was a short walk from the Haram. My father still talks about it." },
  { name: "Hamza Q.", city: "Lahore", trip: "Hunza & Khunjerab", rating: 5, text: "Driver was careful on the KKH, hotels were clean and the guide knew every stop. Worth every rupee." },
  { name: "Sana & Bilal", city: "Islamabad", trip: "Maldives honeymoon", rating: 5, text: "Water villa upgrade, flowers on the bed, smooth transfers. They answered WhatsApp within minutes the whole trip." },
  { name: "Imran K.", city: "Manchester, UK", trip: "Air tickets MAN–LHE", rating: 5, text: "Got a better fare than online sites and they changed my return date for free when my plans moved." },
  { name: "Fatima Z.", city: "Multan", trip: "Dubai visa + package", rating: 5, text: "Visa came in four days. The checklist they gave made it simple. Desert safari was the highlight." },
  { name: "Usman T.", city: "Faisalabad", trip: "Corporate travel", rating: 4, text: "Monthly invoicing and one point of contact made our team travel much easier to manage." }
];
const FAQS = [
  { q: "How much does an Umrah package from Pakistan cost?", a: "Umrah packages with Baba Travels start from PKR 289,000 per person on a sharing basis for 14 nights, including visa, return flights, hotels and transport. Family and premium packages near the Haram range from PKR 365,000 to PKR 540,000." },
  { q: "How do I book a tour or ticket with Baba Travels?", a: "Send your dates and number of travellers through our quote form or WhatsApp. An advisor replies with options within 30 minutes during office hours. Once you confirm and pay, tickets and vouchers are sent by WhatsApp and email." },
  { q: "Which payment methods do you accept?", a: "We accept bank transfer, debit and credit cards, JazzCash and Easypaisa. Overseas Pakistanis can pay from the UK, UAE or Saudi Arabia by bank transfer." },
  { q: "Can you help with a UAE or Saudi visit visa?", a: "Yes. We process UAE, Saudi, Turkey, Malaysia, UK and Schengen visas. UAE visit visas typically take 3–5 working days with complete documents." },
  { q: "When is the best time to visit Hunza and Skardu?", a: "April to October. April brings cherry and apricot blossoms, June to September is best for Deosai and high passes, and October has autumn colours." },
  { q: "Do you offer support while I am travelling?", a: "Yes. Our WhatsApp line is answered 24/7 by a real advisor, and partner desks in Dubai, Jeddah and Istanbul can help on the ground." }
];
const POSTS = [
  { slug: "umrah-checklist-2026", title: "Umrah checklist 2026: documents, packing and first-day plan", excerpt: "Everything to prepare before you fly, from Nusuk registration to what to carry in your ihram bag.", author: "Baba Travels Umrah desk", updated: "2026-11-02", read: "7 min", img: "umrah" },
  { slug: "hunza-in-autumn", title: "Hunza in autumn: a 6-day route with the best colour", excerpt: "Where to stay, which days to drive, and why late October beats spring for photography.", author: "Northern tours team", updated: "2026-10-18", read: "6 min", img: "hunza" },
  { slug: "dubai-visa-pakistanis", title: "Dubai visit visa for Pakistanis: fees, timing and rejections", excerpt: "The exact documents, current processing times and the mistakes that cause rejections.", author: "Visa desk", updated: "2026-11-10", read: "5 min", img: "dubai" }
];
const NAV = [
  { label: "Services", to: "/services", mega: true },
  { label: "Packages", to: "/packages" },
  { label: "Destinations", to: "/destinations/hunza-valley", dest: true },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" }
];
const ROUTES_LIST = [
  "/",
  "/services",
  "/packages",
  "/about",
  "/contact",
  "/quote",
  ...SERVICES$1.map((s) => `/services/${s.slug}`),
  ...DESTINATIONS.map((d) => `/destinations/${d.slug}`),
  ...POSTS.map((p) => `/blog/${p.slug}`)
];
const prefersReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
function useRevealAll(dep) {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]:not(.is-in)");
    if (!("IntersectionObserver" in window) || prefersReduced()) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [dep]);
}
function useInView(opts = { threshold: 0.3 }) {
  const ref = useRef(null);
  const [inView, set] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return set(true);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        set(true);
        io.disconnect();
      }
    }, opts);
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}
function useTilt(max = 8) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || prefersReduced()) return;
    let raf = 0;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--rx", `${(0.5 - y) * max}deg`);
        el.style.setProperty("--ry", `${(x - 0.5) * max}deg`);
        el.style.setProperty("--mx", `${x * 100}%`);
        el.style.setProperty("--my", `${y * 100}%`);
      });
    };
    const leave = () => {
      cancelAnimationFrame(raf);
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [max]);
  return ref;
}
function useMagnetic(strength = 0.25) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || prefersReduced()) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate3d(${(e.clientX - r.left - r.width / 2) * strength}px, ${(e.clientY - r.top - r.height / 2) * strength}px, 0)`;
    };
    const leave = () => {
      el.style.transform = "";
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);
  return ref;
}
function useTheme() {
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || "dark");
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    const apply = () => {
      var _a2;
      document.documentElement.setAttribute("data-theme", next);
      (_a2 = document.querySelector('meta[name="theme-color"]')) == null ? void 0 : _a2.setAttribute("content", next === "dark" ? "#070D12" : "#F6F1E9");
      try {
        localStorage.setItem("bt-theme", next);
      } catch (e) {
      }
      setTheme(next);
    };
    if (document.startViewTransition && !prefersReduced()) document.startViewTransition(apply);
    else apply();
  };
  return [theme, toggle];
}
const asset = (p) => `${"/"}${p.replace(/^\//, "")}`;
const heroImg = (name, size = 1280) => asset(`images/hero/${name}-${size}.webp`);
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(null);
  const [theme, toggle] = useTheme();
  const progress = useRef(null);
  const loc = useLocation();
  const cta = useMagnetic(0.3);
  const closeTimer = useRef(0);
  const darkTop = /^\/($|services|packages|destinations|about|contact|blog)/.test(loc.pathname);
  useEffect(() => {
    setOpen(false);
    setMega(null);
  }, [loc.pathname]);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        const max = document.documentElement.scrollHeight - innerHeight;
        if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      });
    };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const esc = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMega(null);
      }
    };
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [open]);
  const openMega = (k) => {
    clearTimeout(closeTimer.current);
    setMega(k);
  };
  const closeMega = () => {
    closeTimer.current = setTimeout(() => setMega(null), 140);
  };
  return /* @__PURE__ */ jsxs("header", { className: `nav ${scrolled || !darkTop ? "nav--scrolled" : ""} ${open ? "nav--open" : ""}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "nav__bar container", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", className: "nav__brand", "aria-label": `${SITE.name} home`, children: /* @__PURE__ */ jsx(Logo, {}) }),
      /* @__PURE__ */ jsx("nav", { className: "nav__links", "aria-label": "Primary", children: NAV.map((item) => {
        const key = item.mega ? "services" : item.dest ? "dest" : null;
        return key ? /* @__PURE__ */ jsx("div", { className: "nav__item", onMouseEnter: () => openMega(key), onMouseLeave: closeMega, children: /* @__PURE__ */ jsxs(
          "button",
          {
            className: `nav__link ${mega === key ? "is-active" : ""}`,
            "aria-expanded": mega === key,
            "aria-controls": `mega-${key}`,
            onClick: () => setMega(mega === key ? null : key),
            children: [
              item.label,
              /* @__PURE__ */ jsx(Icon, { name: "ChevronDown", size: 16, className: "nav__chev" })
            ]
          }
        ) }, item.label) : /* @__PURE__ */ jsx(NavLink, { to: item.to, className: ({ isActive }) => `nav__link ${isActive ? "is-current" : ""}`, children: item.label }, item.label);
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "nav__actions", children: [
        /* @__PURE__ */ jsx("button", { className: "icon-btn theme-toggle", onClick: toggle, "aria-label": `Switch to ${theme === "dark" ? "light" : "dark"} theme`, children: /* @__PURE__ */ jsxs("span", { className: "theme-toggle__icons", "data-theme-icon": theme, children: [
          /* @__PURE__ */ jsx(Icon, { name: "Sun", size: 18 }),
          /* @__PURE__ */ jsx(Icon, { name: "MoonStar", size: 18 })
        ] }) }),
        /* @__PURE__ */ jsxs("a", { className: "nav__phone", href: `tel:${SITE.phoneHref}`, children: [
          /* @__PURE__ */ jsx(Icon, { name: "Phone", size: 16 }),
          SITE.phone
        ] }),
        /* @__PURE__ */ jsx(Link, { ref: cta, to: "/quote", className: "btn btn--primary btn--sm nav__cta", children: "Get a quote" }),
        /* @__PURE__ */ jsx("button", { className: "icon-btn nav__burger", onClick: () => setOpen(!open), "aria-expanded": open, "aria-controls": "mobile-menu", "aria-label": open ? "Close menu" : "Open menu", children: /* @__PURE__ */ jsxs("span", { className: "burger", children: [
          /* @__PURE__ */ jsx("span", {}),
          /* @__PURE__ */ jsx("span", {})
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { id: "mega-services", className: `mega ${mega === "services" ? "is-open" : ""}`, onMouseEnter: () => openMega("services"), onMouseLeave: closeMega, children: /* @__PURE__ */ jsxs("div", { className: "mega__inner container", children: [
      /* @__PURE__ */ jsx("div", { className: "mega__grid", children: SERVICES$1.map((s) => /* @__PURE__ */ jsxs(Link, { to: `/services/${s.slug}`, className: "mega__link", tabIndex: mega === "services" ? 0 : -1, children: [
        /* @__PURE__ */ jsx("span", { className: "mega__icon", children: /* @__PURE__ */ jsx(Icon, { name: s.icon, size: 18 }) }),
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("strong", { children: s.title }),
          /* @__PURE__ */ jsx("small", { children: s.short })
        ] })
      ] }, s.slug)) }),
      /* @__PURE__ */ jsxs(Link, { to: "/packages", className: "mega__feature", tabIndex: mega === "services" ? 0 : -1, children: [
        /* @__PURE__ */ jsx("img", { src: heroImg("umrah", "thumb"), alt: "", loading: "lazy", width: "480", height: "270" }),
        /* @__PURE__ */ jsxs("span", { className: "mega__feature-body", children: [
          /* @__PURE__ */ jsx("span", { className: "chip chip--accent", children: "Season pick" }),
          /* @__PURE__ */ jsx("strong", { children: "Family Umrah · 21 nights" }),
          /* @__PURE__ */ jsx("small", { children: "4★ hotels 400 m from Haram · from PKR 365,000" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { id: "mega-dest", className: `mega ${mega === "dest" ? "is-open" : ""}`, onMouseEnter: () => openMega("dest"), onMouseLeave: closeMega, children: /* @__PURE__ */ jsx("div", { className: "mega__inner container mega__dest", children: DESTINATIONS.map((d) => /* @__PURE__ */ jsxs(Link, { to: `/destinations/${d.slug}`, className: "mega__dcard", tabIndex: mega === "dest" ? 0 : -1, children: [
      /* @__PURE__ */ jsx("img", { src: heroImg(d.img, "thumb"), alt: "", loading: "lazy", width: "480", height: "270" }),
      /* @__PURE__ */ jsxs("span", { children: [
        /* @__PURE__ */ jsx("strong", { children: d.name }),
        /* @__PURE__ */ jsxs("small", { children: [
          "from ",
          d.from
        ] })
      ] })
    ] }, d.slug)) }) }),
    /* @__PURE__ */ jsx("div", { className: "nav__progress", ref: progress, "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs("div", { id: "mobile-menu", className: "drawer", "aria-hidden": !open, inert: open ? void 0 : "", children: [
      /* @__PURE__ */ jsxs("nav", { className: "drawer__nav", "aria-label": "Mobile", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", style: { "--i": 0 }, children: "Home" }),
        /* @__PURE__ */ jsx(Link, { to: "/services", style: { "--i": 1 }, children: "Services" }),
        /* @__PURE__ */ jsx(Link, { to: "/packages", style: { "--i": 2 }, children: "Packages" }),
        /* @__PURE__ */ jsx(Link, { to: "/destinations/hunza-valley", style: { "--i": 3 }, children: "Destinations" }),
        /* @__PURE__ */ jsx(Link, { to: "/about", style: { "--i": 4 }, children: "About" }),
        /* @__PURE__ */ jsx(Link, { to: "/contact", style: { "--i": 5 }, children: "Contact" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "drawer__chips", children: SERVICES$1.slice(0, 6).map((s) => /* @__PURE__ */ jsxs(Link, { to: `/services/${s.slug}`, className: "chip", children: [
        /* @__PURE__ */ jsx(Icon, { name: s.icon, size: 14 }),
        s.title
      ] }, s.slug)) }),
      /* @__PURE__ */ jsxs("div", { className: "drawer__foot", children: [
        /* @__PURE__ */ jsx(Link, { to: "/quote", className: "btn btn--primary btn--block", children: "Get a free quote" }),
        /* @__PURE__ */ jsxs("a", { href: `tel:${SITE.phoneHref}`, className: "btn btn--ghost btn--block", children: [
          /* @__PURE__ */ jsx(Icon, { name: "Phone", size: 18 }),
          SITE.phone
        ] })
      ] })
    ] })
  ] });
}
const waLink = (msg = "Assalam o Alaikum, I would like a travel quote.") => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
function Footer() {
  return /* @__PURE__ */ jsxs("footer", { className: "footer", children: [
    /* @__PURE__ */ jsx("div", { className: "footer__glow", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsxs("div", { className: "footer__top", children: [
        /* @__PURE__ */ jsxs("div", { className: "footer__brand", children: [
          /* @__PURE__ */ jsx(Logo, {}),
          /* @__PURE__ */ jsx("p", { children: SITE.description }),
          /* @__PURE__ */ jsxs("div", { className: "footer__rating", children: [
            /* @__PURE__ */ jsx("span", { className: "stars", "aria-hidden": "true", children: "★★★★★" }),
            " ",
            SITE.rating.value,
            "/5 from ",
            SITE.rating.count.toLocaleString(),
            " Google reviews"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "footer__social", children: [
            /* @__PURE__ */ jsx("a", { href: SITE.social.facebook, "aria-label": "Facebook", className: "icon-btn", children: /* @__PURE__ */ jsx(Icon, { name: "Facebook", size: 18 }) }),
            /* @__PURE__ */ jsx("a", { href: SITE.social.instagram, "aria-label": "Instagram", className: "icon-btn", children: /* @__PURE__ */ jsx(Icon, { name: "Instagram", size: 18 }) }),
            /* @__PURE__ */ jsx("a", { href: SITE.social.youtube, "aria-label": "YouTube", className: "icon-btn", children: /* @__PURE__ */ jsx(Icon, { name: "Youtube", size: 18 }) }),
            /* @__PURE__ */ jsx("a", { href: waLink(), "aria-label": "WhatsApp", className: "icon-btn", children: /* @__PURE__ */ jsx(WhatsAppIcon, { size: 18 }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "footer__cols", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "footer__h", children: "Services" }),
            /* @__PURE__ */ jsx("ul", { children: SERVICES$1.slice(0, 7).map((s) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: `/services/${s.slug}`, children: s.title }) }, s.slug)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "footer__h", children: "Destinations" }),
            /* @__PURE__ */ jsxs("ul", { children: [
              DESTINATIONS.map((d) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { to: `/destinations/${d.slug}`, children: [
                d.name,
                " tours"
              ] }) }, d.slug)),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/packages", children: "All packages" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "footer__h", children: "Company" }),
            /* @__PURE__ */ jsxs("ul", { children: [
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/about", children: "About us" }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/contact", children: "Contact & offices" }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/quote", children: "Get a quote" }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/blog/umrah-checklist-2026", children: "Travel guides" }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/contact", children: "Terms & refunds" }) }),
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/contact", children: "Privacy policy" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "footer__h", children: "Offices" }),
            /* @__PURE__ */ jsx("ul", { className: "footer__offices", children: OFFICES.map((o) => /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: o.city }),
              /* @__PURE__ */ jsx("span", { children: o.address }),
              /* @__PURE__ */ jsx("a", { href: `tel:${o.phone.replace(/\s/g, "")}`, children: o.phone })
            ] }, o.id)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("svg", { className: "footer__word", viewBox: "0 0 1000 150", "aria-hidden": "true", focusable: "false", children: [
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "fw", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsx("stop", { offset: "0", stopColor: "#fff", stopOpacity: ".14" }),
          /* @__PURE__ */ jsx("stop", { offset: ".9", stopColor: "#fff", stopOpacity: "0" })
        ] }) }),
        /* @__PURE__ */ jsx("text", { x: "0", y: "128", textLength: "1000", lengthAdjust: "spacingAndGlyphs", fill: "url(#fw)", children: "Baba Travels" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "footer__bottom", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " ",
          SITE.name,
          ". All rights reserved."
        ] }),
        /* @__PURE__ */ jsx("span", { children: "DTS Licence No. 0000 · IATA 00-0 0000 0 " }),
        /* @__PURE__ */ jsx("a", { href: "#top", onClick: (e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, children: "Back to top ↑" })
      ] })
    ] })
  ] });
}
function MobileBar() {
  return /* @__PURE__ */ jsxs("nav", { className: "mbar", "aria-label": "Quick actions", children: [
    /* @__PURE__ */ jsxs(Link, { to: "/quote", className: "mbar__item mbar__item--primary", children: [
      /* @__PURE__ */ jsx(Icon, { name: "Send", size: 20 }),
      /* @__PURE__ */ jsx("span", { children: "Quote" })
    ] }),
    /* @__PURE__ */ jsxs(Link, { to: "/packages", className: "mbar__item", children: [
      /* @__PURE__ */ jsx(Icon, { name: "Sparkles", size: 20 }),
      /* @__PURE__ */ jsx("span", { children: "Packages" })
    ] }),
    /* @__PURE__ */ jsxs("a", { href: waLink(), className: "mbar__item mbar__item--wa", children: [
      /* @__PURE__ */ jsx(WhatsAppIcon, { size: 20 }),
      /* @__PURE__ */ jsx("span", { children: "WhatsApp" })
    ] }),
    /* @__PURE__ */ jsxs("a", { href: `tel:${SITE.phoneHref}`, className: "mbar__item", children: [
      /* @__PURE__ */ jsx(Icon, { name: "Phone", size: 20 }),
      /* @__PURE__ */ jsx("span", { children: "Call" })
    ] })
  ] });
}
function WhatsAppFab() {
  return /* @__PURE__ */ jsxs("a", { href: waLink(), className: "wa-fab", "aria-label": "Chat with us on WhatsApp", children: [
    /* @__PURE__ */ jsx("span", { className: "wa-fab__pulse", "aria-hidden": "true" }),
    /* @__PURE__ */ jsx(WhatsAppIcon, { size: 26 }),
    /* @__PURE__ */ jsx("span", { className: "wa-fab__label", children: "Chat with an advisor" })
  ] });
}
function Breadcrumbs({ items }) {
  return /* @__PURE__ */ jsx("nav", { className: "crumbs", "aria-label": "Breadcrumb", children: /* @__PURE__ */ jsx("ol", { children: items.map((it, i) => /* @__PURE__ */ jsx("li", { children: i < items.length - 1 ? /* @__PURE__ */ jsx(Link, { to: it.to, children: it.label }) : /* @__PURE__ */ jsx("span", { "aria-current": "page", children: it.label }) }, it.to)) }) });
}
function SectionHead({ eyebrow, title, intro, align = "left", as: H = "h2", id }) {
  return /* @__PURE__ */ jsxs("div", { className: `shead shead--${align}`, "data-reveal": true, children: [
    eyebrow && /* @__PURE__ */ jsx("span", { className: "eyebrow", children: eyebrow }),
    /* @__PURE__ */ jsx(H, { className: "shead__title", id, children: title }),
    intro && /* @__PURE__ */ jsx("p", { className: "shead__intro", children: intro })
  ] });
}
const INTERVAL = 6500;
const FLIP_MS = 1150;
const STAGGER = 75;
function SlideImg({ slide, i, n, eager }) {
  const im = slide.img;
  return /* @__PURE__ */ jsxs("picture", { children: [
    /* @__PURE__ */ jsx("source", { media: "(max-width: 767px)", srcSet: asset(im.mobile) }),
    /* @__PURE__ */ jsx(
      "img",
      {
        src: asset(im.d1280),
        srcSet: `${asset(im.d1280)} 1280w, ${asset(im.d1920)} 1920w`,
        sizes: "100vw",
        alt: i === 0 ? slide.alt : "",
        width: "1920",
        height: "1080",
        decoding: "async",
        loading: eager ? "eager" : "lazy",
        fetchpriority: eager && i === 0 ? "high" : void 0,
        draggable: "false",
        style: { width: `${n * 100}%`, left: `${-i * 100}%` }
      }
    )
  ] });
}
function HeroCarousel() {
  const total = HERO_SLIDES.length;
  const [panels, setPanels] = useState(5);
  const [active, setActive] = useState(0);
  const [faces, setFaces] = useState({ front: 0, back: 1 });
  const [playing, setPlaying] = useState(true);
  const angle = useRef(0);
  const busy = useRef(false);
  const panelRefs = useRef([]);
  const heroRef = useRef(null);
  const mediaRef = useRef(null);
  const timer = useRef(0);
  const visible = useRef(true);
  const hovering = useRef(false);
  const decoded = useRef(/* @__PURE__ */ new Set([0]));
  const primary = useMagnetic(0.25);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const set = () => setPanels(prefersReduced() ? 1 : mq.matches ? 3 : 6);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const big = window.innerWidth * (window.devicePixelRatio || 1) > 1400;
    const idle = window.requestIdleCallback || ((f) => setTimeout(f, 600));
    idle(() => {
      HERO_SLIDES.forEach((s, i) => {
        var _a2;
        const img2 = new Image();
        img2.src = asset(mobile ? s.img.mobile : big ? s.img.d1920 : s.img.d1280);
        (_a2 = img2.decode) == null ? void 0 : _a2.call(img2).then(() => decoded.current.add(i)).catch(() => decoded.current.add(i));
      });
    });
  }, []);
  const goTo = useCallback((target, dir = 1) => {
    if (busy.current || target === active) return;
    const reduced = prefersReduced();
    const k = Math.round(angle.current / 180);
    const frontVisible = (k % 2 + 2) % 2 === 0;
    const hiddenFace = frontVisible ? "back" : "front";
    busy.current = true;
    setFaces((f) => ({ ...f, [hiddenFace]: target }));
    const run = () => {
      var _a2;
      const from = angle.current;
      const to = from + 180 * dir;
      const els = panelRefs.current.filter(Boolean);
      if (reduced || els.length === 0) {
        angle.current = to;
        els.forEach((el) => el.style.transform = `rotateY(${to}deg)`);
        (_a2 = mediaRef.current) == null ? void 0 : _a2.animate([{ opacity: 0.55 }, { opacity: 1 }], { duration: 400, easing: "ease-out" });
        setActive(target);
        busy.current = false;
        return;
      }
      const mid = (from + to) / 2;
      const depth = window.innerWidth < 768 ? -110 : -220;
      const anims = els.map((el, i) => {
        const order = dir > 0 ? i : els.length - 1 - i;
        return el.animate(
          [
            { transform: `translateZ(0px) rotateY(${from}deg)` },
            { transform: `translateZ(${depth}px) rotateY(${mid}deg)`, offset: 0.5 },
            { transform: `translateZ(0px) rotateY(${to}deg)` }
          ],
          { duration: FLIP_MS, delay: order * STAGGER, easing: "cubic-bezier(.7,0,.2,1)", fill: "forwards" }
        );
      });
      els.forEach((el, i) => {
        const order = dir > 0 ? i : els.length - 1 - i;
        el.querySelectorAll(".hero3d__shade").forEach((shade) => shade.animate([{ opacity: 0 }, { opacity: 0.55, offset: 0.5 }, { opacity: 0 }], { duration: FLIP_MS, delay: order * STAGGER, easing: "ease-in-out" }));
      });
      setTimeout(() => setActive(target), FLIP_MS * 0.45);
      Promise.all(anims.map((a) => a.finished)).then(() => {
        angle.current = to;
        els.forEach((el, i) => {
          el.style.transform = `rotateY(${to}deg)`;
          anims[i].cancel();
        });
        busy.current = false;
      }).catch(() => {
        busy.current = false;
      });
    };
    requestAnimationFrame(() => requestAnimationFrame(() => {
      var _a2;
      const els = panelRefs.current.filter(Boolean);
      const img2 = (_a2 = els[0]) == null ? void 0 : _a2.querySelector(`.hero3d__face--${hiddenFace} img`);
      const ready = decoded.current.has(target) || !(img2 == null ? void 0 : img2.decode) ? Promise.resolve() : img2.decode().catch(() => {
      });
      Promise.race([ready, new Promise((r) => setTimeout(r, 1200))]).then(run);
    }));
  }, [active]);
  const next = useCallback(() => goTo((active + 1) % total, 1), [active, goTo, total]);
  const prev = useCallback(() => goTo((active - 1 + total) % total, -1), [active, goTo, total]);
  useEffect(() => {
    clearTimeout(timer.current);
    if (!playing) return;
    timer.current = setTimeout(function tick() {
      if (visible.current && !hovering.current && !document.hidden) next();
      else timer.current = setTimeout(tick, 1e3);
    }, INTERVAL);
    return () => clearTimeout(timer.current);
  }, [active, playing, next]);
  useEffect(() => {
    const el = heroRef.current;
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
    }, { threshold: 0.25 });
    io.observe(el);
    let raf = 0;
    const onScroll = () => {
      if (prefersReduced()) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight);
        if (mediaRef.current) mediaRef.current.style.transform = `translate3d(0, ${y * 0.28}px, 0)`;
        el.style.setProperty("--hero-fade", String(1 - y / (window.innerHeight * 0.9)));
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      removeEventListener("scroll", onScroll);
    };
  }, []);
  useEffect(() => {
    const el = heroRef.current;
    let x0 = null, y0 = null;
    const s = (e) => {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    };
    const m = (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? next() : prev();
      x0 = null;
    };
    el.addEventListener("touchstart", s, { passive: true });
    el.addEventListener("touchend", m, { passive: true });
    return () => {
      el.removeEventListener("touchstart", s);
      el.removeEventListener("touchend", m);
    };
  }, [next, prev]);
  const slide = HERO_SLIDES[active];
  const words = slide.title.split(" ");
  return /* @__PURE__ */ jsxs(
    "section",
    {
      ref: heroRef,
      className: "hero",
      "aria-roledescription": "carousel",
      "aria-label": "Featured journeys",
      onKeyDown: (e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      },
      children: [
        /* @__PURE__ */ jsx("div", { className: "hero__media", ref: mediaRef, children: /* @__PURE__ */ jsx("div", { className: "hero3d", style: { "--n": panels }, children: Array.from({ length: panels }).map((_, i) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "hero3d__panel",
            ref: (el) => panelRefs.current[i] = el,
            style: { left: `${i * 100 / panels}%`, width: `calc(${100 / panels}% + 1px)`, transform: `rotateY(${angle.current}deg)` },
            children: [
              /* @__PURE__ */ jsxs("div", { className: "hero3d__face hero3d__face--front", children: [
                /* @__PURE__ */ jsx(SlideImg, { slide: HERO_SLIDES[faces.front], i, n: panels, eager: faces.front === 0 }),
                /* @__PURE__ */ jsx("span", { className: "hero3d__shade", "aria-hidden": "true" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "hero3d__face hero3d__face--back", children: [
                /* @__PURE__ */ jsx(SlideImg, { slide: HERO_SLIDES[faces.back], i, n: panels }),
                /* @__PURE__ */ jsx("span", { className: "hero3d__shade", "aria-hidden": "true" })
              ] })
            ]
          },
          `${panels}-${i}`
        )) }) }),
        /* @__PURE__ */ jsx("div", { className: "hero__scrim", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxs("svg", { className: "hero__route", viewBox: "0 0 1440 400", preserveAspectRatio: "none", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsx("path", { d: "M-20 340 C 260 300, 420 120, 720 160 S 1180 60, 1460 40" }),
          /* @__PURE__ */ jsx("circle", { r: "5", children: /* @__PURE__ */ jsx("animateMotion", { dur: "9s", repeatCount: "indefinite", path: "M-20 340 C 260 300, 420 120, 720 160 S 1180 60, 1460 40" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hero__center container", children: [
          /* @__PURE__ */ jsxs("h1", { className: "hero__h1", children: [
            /* @__PURE__ */ jsx("span", { className: "hero__h1-dot", "aria-hidden": "true" }),
            "Baba Travels & Tours — flights, Umrah & tours from Pakistan"
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "hero__place", children: [
            /* @__PURE__ */ jsx(Icon, { name: "MapPin", size: 16 }),
            slide.place
          ] }, `p-${active}`),
          /* @__PURE__ */ jsx("p", { className: "hero__display", "aria-live": "polite", children: words.map((w, i) => /* @__PURE__ */ jsxs(React3.Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "word", style: { "--d": `${i * 55}ms` }, children: /* @__PURE__ */ jsx("span", { className: i >= words.length - 2 ? "word__in word__in--em" : "word__in", children: w }) }),
            i < words.length - 1 ? " " : ""
          ] }, i)) }, `t-${active}`),
          /* @__PURE__ */ jsxs("div", { className: "hero__ctas", children: [
            /* @__PURE__ */ jsxs(Link, { ref: primary, to: slide.to, className: "btn btn--primary btn--lg", children: [
              "Explore this trip",
              /* @__PURE__ */ jsx(Icon, { name: "ArrowRight", size: 18 })
            ] }),
            /* @__PURE__ */ jsx("a", { href: waLink(`Hi, I'm interested in: ${slide.place}`), className: "btn btn--glass btn--lg", children: "Ask on WhatsApp" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hero__bottom container", onMouseEnter: () => hovering.current = true, onMouseLeave: () => hovering.current = false, children: [
          /* @__PURE__ */ jsxs("div", { className: "hero__meta", children: [
            /* @__PURE__ */ jsx("span", { className: "hero__meta-k", children: "From" }),
            /* @__PURE__ */ jsx("strong", { className: "hero__price", children: slide.from }),
            /* @__PURE__ */ jsx("span", { className: "hero__meta-v", children: slide.meta })
          ] }, `m-${active}`),
          /* @__PURE__ */ jsx("div", { className: "hero__tabs", role: "tablist", "aria-label": "Choose slide", children: HERO_SLIDES.map((s, i) => /* @__PURE__ */ jsxs(
            "button",
            {
              role: "tab",
              "aria-selected": i === active,
              "aria-label": `Slide ${i + 1}: ${s.place}`,
              className: `hero__tab ${i === active ? "is-active" : ""}`,
              onClick: () => goTo(i, i > active ? 1 : -1),
              children: [
                /* @__PURE__ */ jsx("span", { className: "hero__tab-label", children: s.place.split(" · ")[0] }),
                /* @__PURE__ */ jsx("span", { className: "hero__tab-bar", children: /* @__PURE__ */ jsx("span", { className: "hero__tab-fill", style: { animationDuration: `${INTERVAL}ms`, animationPlayState: playing ? "running" : "paused" } }, i === active ? `a-${active}` : "x") })
              ]
            },
            s.id
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "hero__ctrl", children: [
            /* @__PURE__ */ jsxs("span", { className: "hero__count", children: [
              /* @__PURE__ */ jsx("b", { children: String(active + 1).padStart(2, "0") }),
              " / ",
              String(total).padStart(2, "0")
            ] }),
            /* @__PURE__ */ jsx("button", { className: "icon-btn icon-btn--glass", onClick: prev, "aria-label": "Previous slide", children: /* @__PURE__ */ jsx(Icon, { name: "ChevronLeft" }) }),
            /* @__PURE__ */ jsx("button", { className: "icon-btn icon-btn--glass", onClick: () => setPlaying(!playing), "aria-label": playing ? "Pause slideshow" : "Play slideshow", children: playing ? /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 14 14", "aria-hidden": "true", children: [
              /* @__PURE__ */ jsx("rect", { x: "2", y: "1", width: "3.5", height: "12", rx: "1", fill: "currentColor" }),
              /* @__PURE__ */ jsx("rect", { x: "8.5", y: "1", width: "3.5", height: "12", rx: "1", fill: "currentColor" })
            ] }) : /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 14 14", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M3 1.5v11l9-5.5z", fill: "currentColor" }) }) }),
            /* @__PURE__ */ jsx("button", { className: "icon-btn icon-btn--glass", onClick: next, "aria-label": "Next slide", children: /* @__PURE__ */ jsx(Icon, { name: "ChevronRight" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "hero__scrollcue", "aria-hidden": "true", children: /* @__PURE__ */ jsx("span", {}) })
      ]
    }
  );
}
const TABS = [
  { id: "flights", label: "Flights", icon: "Plane", fields: [["from", "From", "Karachi (KHI)"], ["to", "To", "Dubai (DXB)"], ["date", "Depart", "", "date"], ["pax", "Travellers", "2 adults"]] },
  { id: "umrah", label: "Umrah", icon: "Moon", fields: [["from", "Departure city", "Lahore"], ["nights", "Nights", "14 nights"], ["date", "Month", "", "month"], ["pax", "Travellers", "4 (family)"]] },
  { id: "tours", label: "Tours", icon: "Mountain", fields: [["to", "Destination", "Hunza, Skardu, Turkey…"], ["date", "Start date", "", "date"], ["days", "Days", "6 days"], ["pax", "Travellers", "2 adults"]] },
  { id: "visa", label: "Visa", icon: "Stamp", fields: [["to", "Country", "UAE, Saudi, UK…"], ["type", "Visa type", "Tourist / visit"], ["date", "Travel date", "", "date"], ["pax", "Applicants", "1"]] },
  { id: "car", label: "Car", icon: "Car", fields: [["from", "Pickup", "Islamabad airport"], ["to", "Drop-off", "Naran"], ["date", "Date", "", "date"], ["pax", "Vehicle", "SUV / Coaster"]] }
];
function BookingWidget() {
  const [tab, setTab] = useState("flights");
  const nav = useNavigate();
  const t = TABS.find((x) => x.id === tab);
  const submit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    nav(`/quote?${new URLSearchParams({ service: tab, ...data })}`);
  };
  return /* @__PURE__ */ jsx("section", { className: "booking container", "aria-labelledby": "booking-title", children: /* @__PURE__ */ jsxs("div", { className: "booking__card glass", "data-reveal": true, children: [
    /* @__PURE__ */ jsxs("div", { className: "booking__head", children: [
      /* @__PURE__ */ jsxs("h2", { id: "booking-title", className: "booking__title", children: [
        "Plan your trip ",
        /* @__PURE__ */ jsx("em", { children: "in seconds" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "booking__tabs", role: "tablist", "aria-label": "Trip type", children: TABS.map((x) => /* @__PURE__ */ jsxs(
        "button",
        {
          role: "tab",
          type: "button",
          "aria-selected": tab === x.id,
          "aria-controls": "booking-panel",
          className: `booking__tab ${tab === x.id ? "is-active" : ""}`,
          onClick: () => setTab(x.id),
          children: [
            /* @__PURE__ */ jsx(Icon, { name: x.icon, size: 16 }),
            x.label
          ]
        },
        x.id
      )) })
    ] }),
    /* @__PURE__ */ jsxs("form", { id: "booking-panel", role: "tabpanel", className: "booking__form", onSubmit: submit, children: [
      t.fields.map(([name, label, ph, type], i) => /* @__PURE__ */ jsxs("label", { className: "field field--float", style: { "--i": i }, children: [
        /* @__PURE__ */ jsx("span", { className: "field__label", children: label }),
        /* @__PURE__ */ jsx("input", { name, type: type || "text", placeholder: ph || " ", autoComplete: "off" })
      ] }, name)),
      /* @__PURE__ */ jsxs("button", { className: "btn btn--primary booking__go", type: "submit", children: [
        /* @__PURE__ */ jsx(Icon, { name: "Search", size: 18 }),
        "Get prices"
      ] })
    ] }, tab),
    /* @__PURE__ */ jsxs("p", { className: "booking__note", children: [
      /* @__PURE__ */ jsx(Icon, { name: "Check", size: 14 }),
      "Free quote in 30 minutes · No booking fee · Pay in PKR"
    ] })
  ] }) });
}
function ServiceCard({ s, i, featured }) {
  const ref = useTilt(7);
  return /* @__PURE__ */ jsxs(Link, { ref, to: `/services/${s.slug}`, className: `scard ${featured ? "scard--feature" : ""}`, "data-reveal": true, style: { "--rd": `${i % 4 * 70}ms` }, children: [
    /* @__PURE__ */ jsx("span", { className: "scard__spot", "aria-hidden": "true" }),
    /* @__PURE__ */ jsx("span", { className: "scard__icon", children: /* @__PURE__ */ jsx(Icon, { name: s.icon, size: 22 }) }),
    /* @__PURE__ */ jsx("h3", { className: "scard__title", children: s.title }),
    /* @__PURE__ */ jsx("p", { className: "scard__text", children: s.short }),
    /* @__PURE__ */ jsxs("span", { className: "scard__more", children: [
      "Learn more ",
      /* @__PURE__ */ jsx(Icon, { name: "ArrowUpRight", size: 16 })
    ] }),
    /* @__PURE__ */ jsx("span", { className: "scard__num", "aria-hidden": "true", children: String(i + 1).padStart(2, "0") })
  ] });
}
function PackageCard({ p, i = 0 }) {
  const ref = useTilt(5);
  const img2 = p.cat === "Umrah" ? "umrah" : p.cat === "Northern Pakistan" ? "hunza" : p.id.startsWith("dubai") ? "dubai" : p.id.startsWith("maldives") ? "islands" : "skies";
  return /* @__PURE__ */ jsxs("article", { ref, className: "pcard", "data-reveal": true, style: { "--rd": `${i % 3 * 80}ms` }, children: [
    /* @__PURE__ */ jsxs("div", { className: "pcard__media", children: [
      /* @__PURE__ */ jsx("img", { src: heroImg(img2, 1280), alt: "", loading: "lazy", decoding: "async", width: "1280", height: "720" }),
      p.badge && /* @__PURE__ */ jsx("span", { className: "chip chip--accent pcard__badge", children: p.badge }),
      /* @__PURE__ */ jsx("span", { className: "pcard__cat", children: p.cat })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pcard__body", children: [
      /* @__PURE__ */ jsx("h3", { className: "pcard__title", children: p.title }),
      /* @__PURE__ */ jsxs("p", { className: "pcard__sub", children: [
        /* @__PURE__ */ jsx(Icon, { name: "CalendarDays", size: 15 }),
        p.nights,
        " · ",
        p.hotel
      ] }),
      /* @__PURE__ */ jsx("ul", { className: "pcard__perks", children: p.perks.map((x) => /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx(Icon, { name: "Check", size: 14 }),
        x
      ] }, x)) }),
      /* @__PURE__ */ jsxs("div", { className: "pcard__foot", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("small", { children: "from / person" }),
          /* @__PURE__ */ jsx("strong", { children: p.price })
        ] }),
        /* @__PURE__ */ jsx(Link, { to: `/quote?service=${encodeURIComponent(p.cat)}&package=${p.id}`, className: "btn btn--primary btn--sm", "aria-label": `Book ${p.title}`, children: "Book" })
      ] })
    ] })
  ] });
}
function DestCard({ d, i }) {
  return /* @__PURE__ */ jsxs(Link, { to: `/destinations/${d.slug}`, className: "dcard", "data-reveal": true, style: { "--rd": `${i * 70}ms` }, children: [
    /* @__PURE__ */ jsx("img", { src: heroImg(d.img, 1280), alt: `${d.name}, ${d.region}`, loading: "lazy", decoding: "async", width: "1280", height: "720", style: d.tone }),
    /* @__PURE__ */ jsx("span", { className: "dcard__shade", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs("span", { className: "dcard__body", children: [
      /* @__PURE__ */ jsx("span", { className: "dcard__region", children: d.region }),
      /* @__PURE__ */ jsx("h3", { className: "dcard__name", children: d.name }),
      /* @__PURE__ */ jsxs("span", { className: "dcard__meta", children: [
        d.days,
        " · from ",
        /* @__PURE__ */ jsx("b", { children: d.from })
      ] })
    ] }),
    /* @__PURE__ */ jsx("span", { className: "dcard__go", "aria-hidden": "true", children: /* @__PURE__ */ jsx(Icon, { name: "ArrowUpRight", size: 20 }) })
  ] });
}
const HUBS = { KHI: [596, 262], LHE: [640, 214], ISB: [636, 196] };
const CITIES = [
  { code: "JED", name: "Jeddah", pos: [470, 290], from: "KHI", info: "Umrah · 4h 05m direct" },
  { code: "MED", name: "Madinah", pos: [462, 262], from: "LHE", info: "Umrah · 4h 40m direct" },
  { code: "DXB", name: "Dubai", pos: [540, 270], from: "KHI", info: "Holidays · 2h 10m direct" },
  { code: "IST", name: "Istanbul", pos: [430, 170], from: "ISB", info: "Tours · 6h 15m direct" },
  { code: "LHR", name: "London", pos: [330, 120], from: "ISB", info: "Diaspora · 8h 30m direct" },
  { code: "YYZ", name: "Toronto", pos: [120, 150], from: "LHE", info: "Diaspora · 1 stop" },
  { code: "KUL", name: "Kuala Lumpur", pos: [800, 360], from: "KHI", info: "Tours · 1 stop" },
  { code: "BKK", name: "Bangkok", pos: [780, 300], from: "LHE", info: "Tours · 1 stop" },
  { code: "GYD", name: "Baku", pos: [500, 160], from: "LHE", info: "Tours · 1 stop" },
  { code: "MLE", name: "Malé", pos: [650, 380], from: "KHI", info: "Honeymoon · 1 stop" }
];
const arc = ([x1, y1], [x2, y2]) => {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.28 - 20;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
};
function RouteMap() {
  const [ref, inView] = useInView({ threshold: 0.25 });
  const [hover, setHover] = useState(null);
  const dots = [];
  for (let y = 60; y < 420; y += 14) for (let x = 40; x < 920; x += 14) {
    const v = Math.sin(x * 0.021) * Math.cos(y * 0.034) + Math.sin((x + y) * 0.011);
    if (v > 0.35) dots.push([x, y]);
  }
  return /* @__PURE__ */ jsxs("div", { ref, className: `routemap ${inView ? "is-in" : ""}`, children: [
    /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 960 460", className: "routemap__svg", role: "img", "aria-labelledby": "rm-title rm-desc", children: [
      /* @__PURE__ */ jsx("title", { id: "rm-title", children: "Baba Travels route network" }),
      /* @__PURE__ */ jsx("desc", { id: "rm-desc", children: "Routes from Karachi, Lahore and Islamabad to Jeddah, Madinah, Dubai, Istanbul, London, Toronto, Kuala Lumpur, Bangkok, Baku and Malé." }),
      /* @__PURE__ */ jsx("g", { className: "routemap__dots", children: dots.map(([x, y], i) => /* @__PURE__ */ jsx("circle", { cx: x, cy: y, r: "1.6" }, i)) }),
      CITIES.map((c, i) => {
        const d = arc(HUBS[c.from], c.pos);
        return /* @__PURE__ */ jsxs("g", { className: `route ${hover && hover !== c.code ? "is-dim" : ""} ${hover === c.code ? "is-hot" : ""}`, style: { "--i": i }, children: [
          /* @__PURE__ */ jsx("path", { d, className: "route__line", pathLength: "1" }),
          inView && !prefersReduced() && /* @__PURE__ */ jsx("circle", { r: "3.2", className: "route__plane", children: /* @__PURE__ */ jsx("animateMotion", { dur: `${4 + i % 4}s`, begin: `${1.2 + i * 0.15}s`, repeatCount: "indefinite", path: d }) })
        ] }, c.code);
      }),
      CITIES.map((c) => /* @__PURE__ */ jsxs(
        "g",
        {
          className: "city",
          transform: `translate(${c.pos[0]} ${c.pos[1]})`,
          onMouseEnter: () => setHover(c.code),
          onMouseLeave: () => setHover(null),
          onFocus: () => setHover(c.code),
          onBlur: () => setHover(null),
          tabIndex: "0",
          role: "button",
          "aria-label": `${c.name}: ${c.info}`,
          children: [
            /* @__PURE__ */ jsx("circle", { r: "14", className: "city__halo" }),
            /* @__PURE__ */ jsx("circle", { r: "4.5", className: "city__dot" }),
            /* @__PURE__ */ jsx("text", { y: "-12", textAnchor: "middle", className: "city__label", children: c.code })
          ]
        },
        c.code
      )),
      Object.entries(HUBS).map(([k, [x, y]]) => /* @__PURE__ */ jsxs("g", { transform: `translate(${x} ${y})`, className: "hub", children: [
        /* @__PURE__ */ jsx("circle", { r: "18", className: "hub__pulse" }),
        /* @__PURE__ */ jsx("circle", { r: "7", className: "hub__dot" }),
        /* @__PURE__ */ jsx("text", { x: "12", y: k === "ISB" ? -8 : k === "LHE" ? 14 : 18, className: "hub__label", children: k })
      ] }, k))
    ] }),
    /* @__PURE__ */ jsx("div", { className: "routemap__card glass", "aria-live": "polite", children: hover ? (() => {
      const c = CITIES.find((x) => x.code === hover);
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("strong", { children: [
          c.from,
          " → ",
          c.code
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          c.name,
          " · ",
          c.info
        ] })
      ] });
    })() : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("strong", { children: "Hover a city" }),
      /* @__PURE__ */ jsx("span", { children: "Routes from Karachi, Lahore & Islamabad" })
    ] }) })
  ] });
}
function Steps({ vertical }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  return /* @__PURE__ */ jsxs("ol", { ref, className: `steps ${vertical ? "steps--v" : ""} ${inView ? "is-in" : ""}`, children: [
    /* @__PURE__ */ jsx("span", { className: "steps__line", "aria-hidden": "true", children: /* @__PURE__ */ jsx("span", {}) }),
    STEPS$1.map((s, i) => /* @__PURE__ */ jsxs("li", { className: "step", style: { "--i": i }, children: [
      /* @__PURE__ */ jsx("span", { className: "step__num", children: i + 1 }),
      /* @__PURE__ */ jsx("h3", { className: "step__title", children: s.title }),
      /* @__PURE__ */ jsx("p", { className: "step__text", children: s.text })
    ] }, s.title))
  ] });
}
function Counter({ value, decimals = 0, suffix, run }) {
  const [n, setN] = useState(value);
  const started = useRef(false);
  useEffect(() => {
    if (!run || started.current || prefersReduced()) return;
    started.current = true;
    const t0 = performance.now(), dur = 1600;
    let raf;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 4);
      setN(value * e);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    setN(0);
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, value]);
  return /* @__PURE__ */ jsxs("span", { className: "stat__num", children: [
    n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
    /* @__PURE__ */ jsx("span", { className: "stat__suf", children: suffix })
  ] });
}
function Stats() {
  const [ref, inView] = useInView({ threshold: 0.4 });
  return /* @__PURE__ */ jsx("dl", { ref, className: "stats", children: STATS.map((s) => /* @__PURE__ */ jsxs("div", { className: "stat", "data-reveal": true, children: [
    /* @__PURE__ */ jsx("dt", { className: "stat__label", children: s.label }),
    /* @__PURE__ */ jsx("dd", { children: /* @__PURE__ */ jsx(Counter, { ...s, run: inView }) })
  ] }, s.label)) });
}
function Testimonials() {
  const row = (list, rev) => /* @__PURE__ */ jsx("div", { className: `marquee ${rev ? "marquee--rev" : ""}`, children: /* @__PURE__ */ jsx("div", { className: "marquee__track", children: [...list, ...list].map((t, i) => /* @__PURE__ */ jsxs("figure", { className: "tcard", "aria-hidden": i >= list.length ? "true" : void 0, itemScope: true, itemType: "https://schema.org/Review", children: [
    /* @__PURE__ */ jsxs("div", { className: "tcard__stars", "aria-label": `${t.rating} out of 5 stars`, children: [
      "★".repeat(t.rating),
      /* @__PURE__ */ jsx("span", { children: "★".repeat(5 - t.rating) })
    ] }),
    /* @__PURE__ */ jsxs("blockquote", { className: "tcard__text", itemProp: "reviewBody", children: [
      "“",
      t.text,
      "”"
    ] }),
    /* @__PURE__ */ jsxs("figcaption", { className: "tcard__who", children: [
      /* @__PURE__ */ jsx("span", { className: "tcard__avatar", "aria-hidden": "true", children: t.name[0] }),
      /* @__PURE__ */ jsxs("span", { children: [
        /* @__PURE__ */ jsx("strong", { itemProp: "author", children: t.name }),
        /* @__PURE__ */ jsxs("small", { children: [
          t.city,
          " · ",
          t.trip
        ] })
      ] })
    ] })
  ] }, i)) }) });
  return /* @__PURE__ */ jsxs("div", { className: "tmarquee", children: [
    row(TESTIMONIALS.slice(0, 3)),
    row(TESTIMONIALS.slice(3), true)
  ] });
}
function Faq({ items, idPrefix = "faq" }) {
  const [open, setOpen] = useState(0);
  return /* @__PURE__ */ jsx("div", { className: "faq", children: items.map((f, i) => /* @__PURE__ */ jsxs("div", { className: `faq__item ${open === i ? "is-open" : ""}`, "data-reveal": true, children: [
    /* @__PURE__ */ jsx("h3", { className: "faq__q", children: /* @__PURE__ */ jsxs("button", { "aria-expanded": open === i, "aria-controls": `${idPrefix}-${i}`, id: `${idPrefix}-b${i}`, onClick: () => setOpen(open === i ? -1 : i), children: [
      /* @__PURE__ */ jsx("span", { children: f.q }),
      /* @__PURE__ */ jsx("span", { className: "faq__plus", "aria-hidden": "true" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "faq__a", id: `${idPrefix}-${i}`, role: "region", "aria-labelledby": `${idPrefix}-b${i}`, children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { children: f.a }) }) })
  ] }, f.q)) });
}
function KeyFacts({ facts, title = "Key facts" }) {
  return /* @__PURE__ */ jsxs("aside", { className: "facts glass", "aria-label": title, children: [
    /* @__PURE__ */ jsx("h2", { className: "facts__title", children: title }),
    /* @__PURE__ */ jsx("table", { children: /* @__PURE__ */ jsx("tbody", { children: facts.map(([k, v]) => /* @__PURE__ */ jsxs("tr", { children: [
      /* @__PURE__ */ jsx("th", { scope: "row", children: k }),
      /* @__PURE__ */ jsx("td", { children: v })
    ] }, k)) }) })
  ] });
}
function CtaBand() {
  return /* @__PURE__ */ jsx("section", { className: "cta container", "aria-labelledby": "cta-title", children: /* @__PURE__ */ jsxs("div", { className: "cta__card", "data-reveal": true, children: [
    /* @__PURE__ */ jsx("div", { className: "cta__orb", "aria-hidden": "true" }),
    /* @__PURE__ */ jsx("svg", { className: "cta__route", viewBox: "0 0 800 200", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M0 160 C 200 160 220 40 420 60 S 700 150 800 30" }) }),
    /* @__PURE__ */ jsx("span", { className: "eyebrow eyebrow--dark", children: "Ready when you are" }),
    /* @__PURE__ */ jsx("h2", { id: "cta-title", className: "cta__title", children: "Your next journey is one message away." }),
    /* @__PURE__ */ jsx("p", { className: "cta__text", children: "Tell us where and when. A real advisor replies with clear PKR prices in about 30 minutes." }),
    /* @__PURE__ */ jsxs("div", { className: "cta__btns", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/quote", className: "btn btn--dark btn--lg", children: [
        "Get a free quote",
        /* @__PURE__ */ jsx(Icon, { name: "ArrowRight", size: 18 })
      ] }),
      /* @__PURE__ */ jsxs("a", { href: waLink(), className: "btn btn--wa btn--lg", children: [
        /* @__PURE__ */ jsx(WhatsAppIcon, { size: 20 }),
        "WhatsApp us"
      ] })
    ] })
  ] }) });
}
function PageHero({ img: img2 = "skies", eyebrow, title, children, crumbs }) {
  return /* @__PURE__ */ jsxs("header", { className: "phero", children: [
    /* @__PURE__ */ jsx("div", { className: "phero__media", "aria-hidden": "true", children: /* @__PURE__ */ jsxs("picture", { children: [
      /* @__PURE__ */ jsx("source", { media: "(max-width: 767px)", srcSet: heroImg(img2, "m") }),
      /* @__PURE__ */ jsx(
        "img",
        {
          src: heroImg(img2, 1280),
          srcSet: `${heroImg(img2, 1280)} 1280w, ${heroImg(img2, 1920)} 1920w`,
          sizes: "100vw",
          alt: "",
          width: "1280",
          height: "720",
          loading: "eager",
          fetchpriority: "high",
          decoding: "async"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "phero__scrim", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs("div", { className: "phero__body container", children: [
      crumbs,
      eyebrow && /* @__PURE__ */ jsx("span", { className: "eyebrow eyebrow--light", children: eyebrow }),
      /* @__PURE__ */ jsx("h1", { className: "phero__title", children: title }),
      children
    ] })
  ] });
}
function Seo({ title, description, path = "/", image = "/images/hero/skies-1280.webp", lcp, schema = [], noindex }) {
  const url = SITE.url + path;
  const fullTitle = path === "/" ? `${SITE.name} | ${SITE.tagline}` : `${title} | ${SITE.shortName}`;
  const graphs = Array.isArray(schema) ? schema : [schema];
  return /* @__PURE__ */ jsxs(Helmet, { prioritizeSeoTags: true, children: [
    /* @__PURE__ */ jsx("title", { children: fullTitle }),
    /* @__PURE__ */ jsx("meta", { name: "description", content: description }),
    lcp && /* @__PURE__ */ jsx("link", { rel: "preload", as: "image", href: `/images/hero/${lcp}-m.webp`, media: "(max-width: 767px)", fetchpriority: "high" }),
    lcp && /* @__PURE__ */ jsx("link", { rel: "preload", as: "image", href: `/images/hero/${lcp}-1280.webp`, media: "(min-width: 768px)", fetchpriority: "high" }),
    /* @__PURE__ */ jsx("link", { rel: "canonical", href: url }),
    /* @__PURE__ */ jsx("link", { rel: "alternate", hrefLang: "en-PK", href: url }),
    /* @__PURE__ */ jsx("link", { rel: "alternate", hrefLang: "x-default", href: url }),
    noindex && /* @__PURE__ */ jsx("meta", { name: "robots", content: "noindex,follow" }),
    /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
    /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: SITE.name }),
    /* @__PURE__ */ jsx("meta", { property: "og:title", content: fullTitle }),
    /* @__PURE__ */ jsx("meta", { property: "og:description", content: description }),
    /* @__PURE__ */ jsx("meta", { property: "og:url", content: url }),
    /* @__PURE__ */ jsx("meta", { property: "og:image", content: SITE.url + image }),
    /* @__PURE__ */ jsx("meta", { property: "og:locale", content: "en_PK" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: fullTitle }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: description }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: SITE.url + image }),
    /* @__PURE__ */ jsx("meta", { name: "geo.region", content: "PK-SD" }),
    /* @__PURE__ */ jsx("meta", { name: "geo.placename", content: "Karachi" }),
    graphs.filter(Boolean).map((g, i) => /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", ...g }) }, i))
  ] });
}
const orgSchema = () => ({
  "@type": "TravelAgency",
  "@id": SITE.url + "/#org",
  name: SITE.name,
  url: SITE.url,
  logo: SITE.url + "/favicon.svg",
  image: SITE.url + "/images/hero/skies-1280.webp",
  description: SITE.description,
  telephone: SITE.phone,
  email: SITE.email,
  foundingDate: String(SITE.founded),
  priceRange: "PKR 2,800 – PKR 540,000",
  areaServed: ["Pakistan", "United Arab Emirates", "Saudi Arabia", "United Kingdom", "Canada", "Turkey", "Malaysia"],
  address: { "@type": "PostalAddress", streetAddress: OFFICES[0].address, addressLocality: "Karachi", addressRegion: "Sindh", addressCountry: "PK" },
  geo: { "@type": "GeoCoordinates", latitude: OFFICES[0].geo[0], longitude: OFFICES[0].geo[1] },
  openingHours: "Mo-Sa 09:00-21:00",
  sameAs: Object.values(SITE.social),
  department: OFFICES.slice(1).map((o) => ({
    "@type": "TravelAgency",
    name: `${SITE.name} — ${o.city}`,
    telephone: o.phone,
    address: { "@type": "PostalAddress", streetAddress: o.address, addressLocality: o.city, addressCountry: o.country === "UAE" ? "AE" : "PK" }
  }))
});
const websiteSchema = () => ({
  "@type": "WebSite",
  "@id": SITE.url + "/#website",
  url: SITE.url,
  name: SITE.name,
  inLanguage: "en-PK",
  publisher: { "@id": SITE.url + "/#org" }
});
const faqSchema = (faqs) => ({
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
});
const breadcrumbSchema = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.label, item: SITE.url + it.to }))
});
const serviceSchema = (s) => ({
  "@type": "Service",
  name: s.title,
  description: s.summary,
  serviceType: s.title,
  provider: { "@id": SITE.url + "/#org" },
  areaServed: { "@type": "Country", name: "Pakistan" },
  url: `${SITE.url}/services/${s.slug}`
});
const tripSchema = (d) => ({
  "@type": "TouristTrip",
  name: `${d.name} tour package`,
  description: d.summary,
  touristType: ["Families", "Couples", "Groups"],
  itinerary: { "@type": "ItemList", itemListElement: d.itinerary.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: `Day ${i + 1}: ${t}` })) },
  offers: { "@type": "Offer", priceCurrency: "PKR", price: d.from.replace(/[^0-9]/g, ""), availability: "https://schema.org/InStock", url: `${SITE.url}/destinations/${d.slug}` },
  provider: { "@id": SITE.url + "/#org" }
});
const articleSchema = (p) => ({
  "@type": "Article",
  headline: p.title,
  description: p.excerpt,
  dateModified: p.updated,
  datePublished: p.updated,
  author: { "@type": "Organization", name: p.author },
  publisher: { "@id": SITE.url + "/#org" },
  image: `${SITE.url}/images/hero/${p.img}-1280.webp`,
  mainEntityOfPage: `${SITE.url}/blog/${p.slug}`
});
function Home() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Seo, { path: "/", description: `${SITE.description} Free quotes in 30 minutes on WhatsApp.`, lcp: "hunza", schema: [orgSchema(), websiteSchema(), faqSchema(FAQS)] }),
    /* @__PURE__ */ jsx(HeroCarousel, {}),
    /* @__PURE__ */ jsx(BookingWidget, {}),
    /* @__PURE__ */ jsx("section", { className: "trust container", "aria-label": "Why travellers trust us", children: /* @__PURE__ */ jsxs("ul", { className: "trust__list", "data-reveal": true, children: [
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsxs("span", { className: "trust__big", children: [
          SITE.rating.value,
          /* @__PURE__ */ jsx("small", { children: "/5" })
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          SITE.rating.count.toLocaleString(),
          " Google reviews"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx(Icon, { name: "ShieldCheck" }),
        /* @__PURE__ */ jsx("span", { children: "DTS-licensed agency" })
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx(Icon, { name: "Plane" }),
        /* @__PURE__ */ jsx("span", { children: "IATA-accredited ticketing" })
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx(Icon, { name: "MessageCircle" }),
        /* @__PURE__ */ jsx("span", { children: "24/7 WhatsApp support" })
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx(Icon, { name: "Wallet" }),
        /* @__PURE__ */ jsx("span", { children: "Pay in PKR · JazzCash · Easypaisa" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "section container intro", "aria-labelledby": "intro-title", children: /* @__PURE__ */ jsxs("div", { className: "intro__grid", children: [
      /* @__PURE__ */ jsx(SectionHead, { eyebrow: "Who we are", id: "intro-title", title: /* @__PURE__ */ jsxs(Fragment, { children: [
        "A Pakistani travel agency with a ",
        /* @__PURE__ */ jsx("em", { children: "worldwide" }),
        " reach."
      ] }) }),
      /* @__PURE__ */ jsxs("p", { className: "answer", "data-reveal": true, children: [
        /* @__PURE__ */ jsx("strong", { children: "Baba Travels & Tours" }),
        " is a travel agency in Karachi, Lahore and Islamabad that books air tickets, Umrah and Hajj packages, northern Pakistan tours, international holidays, visas, hotels, car rental and airport transfers. Travellers get a free quote in about 30 minutes, clear prices in PKR, and 24/7 WhatsApp support from departure to return."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "section container", "aria-labelledby": "svc-title", children: [
      /* @__PURE__ */ jsx(
        SectionHead,
        {
          eyebrow: "Services",
          id: "svc-title",
          title: /* @__PURE__ */ jsxs(Fragment, { children: [
            "Everything your journey needs, ",
            /* @__PURE__ */ jsx("em", { children: "under one roof." })
          ] }),
          intro: "From a single ticket to a 40-person Umrah group — one team, one WhatsApp thread, one invoice."
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "bento", children: SERVICES$1.map((s, i) => /* @__PURE__ */ jsx(ServiceCard, { s, i, featured: i < 2 }, s.slug)) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "section section--alt", "aria-labelledby": "pkg-title", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsxs("div", { className: "row-head", children: [
        /* @__PURE__ */ jsx(SectionHead, { eyebrow: "Packages", id: "pkg-title", title: /* @__PURE__ */ jsxs(Fragment, { children: [
          "This season’s ",
          /* @__PURE__ */ jsx("em", { children: "most-booked" }),
          " trips"
        ] }) }),
        /* @__PURE__ */ jsxs(Link, { to: "/packages", className: "btn btn--ghost", children: [
          "All packages",
          /* @__PURE__ */ jsx(Icon, { name: "ArrowRight", size: 18 })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pgrid", children: PACKAGES.slice(1, 7).map((p, i) => /* @__PURE__ */ jsx(PackageCard, { p, i }, p.id)) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "section", "aria-labelledby": "dest-title", children: [
      /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx(SectionHead, { eyebrow: "Destinations", id: "dest-title", title: /* @__PURE__ */ jsxs(Fragment, { children: [
        "Where Pakistan ",
        /* @__PURE__ */ jsx("em", { children: "travels" }),
        " next"
      ] }), intro: "From the Karakoram to the Indian Ocean — swipe through our travellers’ favourite places." }) }),
      /* @__PURE__ */ jsx("div", { className: "hscroll", tabIndex: "0", "aria-label": "Destinations, scroll horizontally", children: DESTINATIONS.map((d, i) => /* @__PURE__ */ jsx(DestCard, { d, i }, d.slug)) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "section container network", "aria-labelledby": "net-title", children: /* @__PURE__ */ jsxs("div", { className: "network__grid", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          SectionHead,
          {
            eyebrow: "Our network",
            id: "net-title",
            title: /* @__PURE__ */ jsxs(Fragment, { children: [
              "From three Pakistani hubs to ",
              /* @__PURE__ */ jsx("em", { children: "60+ countries." })
            ] }),
            intro: "Direct and one-stop routes from Karachi, Lahore and Islamabad to the Gulf, Europe, North America and Asia, with partner desks in Dubai, Jeddah and Istanbul."
          }
        ),
        /* @__PURE__ */ jsx(Stats, {})
      ] }),
      /* @__PURE__ */ jsx(RouteMap, {})
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "section section--alt", "aria-labelledby": "how-title", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsx(SectionHead, { eyebrow: "How it works", id: "how-title", align: "center", title: /* @__PURE__ */ jsxs(Fragment, { children: [
        "Booked in four ",
        /* @__PURE__ */ jsx("em", { children: "calm" }),
        " steps"
      ] }) }),
      /* @__PURE__ */ jsx(Steps, {})
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "section container", "aria-labelledby": "why-title", children: /* @__PURE__ */ jsxs("div", { className: "why", children: [
      /* @__PURE__ */ jsxs("div", { className: "why__media", "data-reveal": true, children: [
        /* @__PURE__ */ jsx("img", { src: heroImg("skies", 1280), alt: "Aircraft above sunrise clouds", loading: "lazy", width: "1280", height: "720" }),
        /* @__PURE__ */ jsxs("div", { className: "why__badge glass", children: [
          /* @__PURE__ */ jsx("span", { className: "why__badge-num", children: "24/7" }),
          /* @__PURE__ */ jsx("span", { children: "Real people on WhatsApp — even at 3 a.m. in Jeddah." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(SectionHead, { eyebrow: "Why Baba Travels", id: "why-title", title: /* @__PURE__ */ jsxs(Fragment, { children: [
          "Travel with people who ",
          /* @__PURE__ */ jsx("em", { children: "pick up." })
        ] }) }),
        /* @__PURE__ */ jsx("ul", { className: "why__list", children: WHY.map((w, i) => /* @__PURE__ */ jsxs("li", { "data-reveal": true, style: { "--rd": `${i * 60}ms` }, children: [
          /* @__PURE__ */ jsx("span", { className: "why__icon", children: /* @__PURE__ */ jsx(Icon, { name: w.icon }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { children: w.title }),
            /* @__PURE__ */ jsx("p", { children: w.text })
          ] })
        ] }, w.title)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "section section--alt testi", "aria-labelledby": "t-title", children: [
      /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx(SectionHead, { eyebrow: "Reviews", id: "t-title", align: "center", title: /* @__PURE__ */ jsxs(Fragment, { children: [
        "Rated ",
        /* @__PURE__ */ jsxs("em", { children: [
          SITE.rating.value,
          "/5"
        ] }),
        " by ",
        SITE.rating.count.toLocaleString(),
        " travellers"
      ] }) }) }),
      /* @__PURE__ */ jsx(Testimonials, {})
    ] }),
    /* @__PURE__ */ jsx("section", { className: "section container", "aria-labelledby": "faq-title", children: /* @__PURE__ */ jsxs("div", { className: "faqwrap", children: [
      /* @__PURE__ */ jsx(SectionHead, { eyebrow: "FAQ", id: "faq-title", title: /* @__PURE__ */ jsxs(Fragment, { children: [
        "Questions travellers ",
        /* @__PURE__ */ jsx("em", { children: "ask us" }),
        " most"
      ] }), intro: "Can’t find yours? Ask on WhatsApp — we reply in minutes." }),
      /* @__PURE__ */ jsx(Faq, { items: FAQS })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "section container", "aria-labelledby": "blog-title", children: [
      /* @__PURE__ */ jsx("div", { className: "row-head", children: /* @__PURE__ */ jsx(SectionHead, { eyebrow: "Travel guides", id: "blog-title", title: /* @__PURE__ */ jsxs(Fragment, { children: [
        "Plan smarter with our ",
        /* @__PURE__ */ jsx("em", { children: "guides" })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "posts", children: POSTS.map((p, i) => /* @__PURE__ */ jsxs("article", { className: "post", "data-reveal": true, style: { "--rd": `${i * 80}ms` }, children: [
        /* @__PURE__ */ jsx(Link, { to: `/blog/${p.slug}`, className: "post__media", children: /* @__PURE__ */ jsx("img", { src: heroImg(p.img, "thumb"), alt: "", loading: "lazy", width: "480", height: "270" }) }),
        /* @__PURE__ */ jsxs("div", { className: "post__body", children: [
          /* @__PURE__ */ jsxs("p", { className: "post__meta", children: [
            "Updated ",
            /* @__PURE__ */ jsx("time", { dateTime: p.updated, children: new Date(p.updated).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) }),
            " · ",
            p.read
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "post__title", children: /* @__PURE__ */ jsx(Link, { to: `/blog/${p.slug}`, children: p.title }) }),
          /* @__PURE__ */ jsx("p", { className: "post__excerpt", children: p.excerpt }),
          /* @__PURE__ */ jsxs("p", { className: "post__author", children: [
            "By ",
            p.author
          ] })
        ] })
      ] }, p.slug)) })
    ] }),
    /* @__PURE__ */ jsx(CtaBand, {})
  ] });
}
function NotFound() {
  return /* @__PURE__ */ jsxs("section", { className: "nf container", children: [
    /* @__PURE__ */ jsx(Seo, { title: "Page not found", path: "/404", description: "This page doesn’t exist.", noindex: true }),
    /* @__PURE__ */ jsx("p", { className: "nf__code", "aria-hidden": "true", children: "404" }),
    /* @__PURE__ */ jsx("h1", { children: "This route isn’t on our map." }),
    /* @__PURE__ */ jsx("p", { children: "The page may have moved. Try our packages or ask us on WhatsApp." }),
    /* @__PURE__ */ jsxs("div", { className: "phero__ctas", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", className: "btn btn--primary", children: "Back home" }),
      /* @__PURE__ */ jsx(Link, { to: "/packages", className: "btn btn--ghost", children: "See packages" })
    ] })
  ] });
}
const IMG = { "air-tickets": "skies", "umrah-hajj-packages": "umrah", "holiday-tour-packages": "hunza", "visa-assistance": "dubai", "hotel-booking": "islands", "car-rental": "hunza", "airport-transfers": "skies", "intercity-coach-booking": "hunza", "corporate-travel": "dubai", "cargo-courier": "skies" };
function Services() {
  const crumbs = [{ label: "Home", to: "/" }, { label: "Services", to: "/services" }];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "Travel services: flights, Umrah, tours & visas",
        path: "/services",
        description: "All Baba Travels services: air tickets, Umrah and Hajj packages, holiday tours, visa assistance, hotels, car rental, airport transfers, coach booking, corporate travel and cargo.",
        lcp: "skies",
        schema: [breadcrumbSchema(crumbs)]
      }
    ),
    /* @__PURE__ */ jsx(PageHero, { img: "skies", eyebrow: "Services", title: "Ten travel services, one team", crumbs: /* @__PURE__ */ jsx(Breadcrumbs, { items: crumbs }), children: /* @__PURE__ */ jsx("p", { className: "phero__lead", children: "Book flights, Umrah, tours, visas and transport in one WhatsApp thread — with a single PKR invoice." }) }),
    /* @__PURE__ */ jsx("section", { className: "section container", children: /* @__PURE__ */ jsx("div", { className: "bento", children: SERVICES$1.map((s, i) => /* @__PURE__ */ jsx(ServiceCard, { s, i, featured: i < 2 }, s.slug)) }) }),
    /* @__PURE__ */ jsx(CtaBand, {})
  ] });
}
function ServiceDetail() {
  var _a2;
  const { slug } = useParams();
  const s = SERVICES$1.find((x) => x.slug === slug);
  if (!s) return /* @__PURE__ */ jsx(NotFound, {});
  const crumbs = [{ label: "Home", to: "/" }, { label: "Services", to: "/services" }, { label: s.title, to: `/services/${s.slug}` }];
  const faqs = [
    { q: `How much does ${s.title.toLowerCase()} cost with Baba Travels?`, a: `${s.title} starts from ${((_a2 = s.facts.find(([k]) => /price/i.test(k))) == null ? void 0 : _a2[1]) || "a clear PKR price"}. You get a full quote with taxes and fees in PKR within about 30 minutes.` },
    { q: `How do I book ${s.title.toLowerCase()}?`, a: "Fill the quote form or message us on WhatsApp with your dates and travellers. Confirm the option you like, pay securely, and receive documents on WhatsApp and email." },
    ...FAQS.slice(2, 4)
  ];
  const related = SERVICES$1.filter((x) => x.slug !== s.slug).slice(0, 3);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: `${s.title} from Pakistan`,
        path: `/services/${s.slug}`,
        description: s.summary.slice(0, 155),
        image: `/images/hero/${IMG[s.slug]}-1280.webp`,
        lcp: IMG[s.slug],
        schema: [serviceSchema(s), breadcrumbSchema(crumbs), faqSchema(faqs)]
      }
    ),
    /* @__PURE__ */ jsx(PageHero, { img: IMG[s.slug], eyebrow: "Service", title: `${s.title} from Pakistan`, crumbs: /* @__PURE__ */ jsx(Breadcrumbs, { items: crumbs }), children: /* @__PURE__ */ jsx("div", { className: "phero__ctas", children: /* @__PURE__ */ jsxs(Link, { to: `/quote?service=${s.slug}`, className: "btn btn--primary btn--lg", children: [
      "Get a quote",
      /* @__PURE__ */ jsx(Icon, { name: "ArrowRight", size: 18 })
    ] }) }) }),
    /* @__PURE__ */ jsxs("section", { className: "section container detail", children: [
      /* @__PURE__ */ jsxs("div", { className: "detail__main", children: [
        /* @__PURE__ */ jsxs("h2", { className: "detail__h2", children: [
          "What is included in our ",
          s.title.toLowerCase(),
          " service?"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "answer answer--boxed", children: s.summary }),
        /* @__PURE__ */ jsx("h2", { className: "detail__h2", children: "What you get" }),
        /* @__PURE__ */ jsx("ul", { className: "ticks", children: s.includes.map((x) => /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx(Icon, { name: "Check", size: 16 }),
          x
        ] }, x)) }),
        /* @__PURE__ */ jsx("h2", { className: "detail__h2", children: "How booking works" }),
        /* @__PURE__ */ jsx(Steps, { vertical: true })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "detail__side", children: [
        /* @__PURE__ */ jsx(KeyFacts, { facts: s.facts, title: `${s.title}: key facts` }),
        /* @__PURE__ */ jsx(Link, { to: `/quote?service=${s.slug}`, className: "btn btn--primary btn--block", children: "Request this service" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "section container faqwrap", "aria-labelledby": "sfaq", children: [
      /* @__PURE__ */ jsx(SectionHead, { eyebrow: "FAQ", id: "sfaq", title: `${s.title}: common questions` }),
      /* @__PURE__ */ jsx(Faq, { items: faqs, idPrefix: "sfaq" })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "section container", "aria-labelledby": "rel", children: [
      /* @__PURE__ */ jsx(SectionHead, { eyebrow: "Related", id: "rel", title: "Often booked together" }),
      /* @__PURE__ */ jsx("div", { className: "bento bento--3", children: related.map((r, i) => /* @__PURE__ */ jsx(ServiceCard, { s: r, i }, r.slug)) })
    ] }),
    /* @__PURE__ */ jsx(CtaBand, {})
  ] });
}
const CATS = ["All", "Umrah", "Northern Pakistan", "International"];
function Packages() {
  const [cat, setCat] = useState("All");
  const crumbs = [{ label: "Home", to: "/" }, { label: "Packages", to: "/packages" }];
  const list = cat === "All" ? PACKAGES : PACKAGES.filter((p) => p.cat === cat);
  const itemList = { "@type": "ItemList", itemListElement: PACKAGES.map((p, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "TouristTrip", name: p.title, offers: { "@type": "Offer", priceCurrency: "PKR", price: p.price.replace(/[^0-9]/g, "") } } })) };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "Umrah, northern Pakistan & international tour packages",
        path: "/packages",
        description: "Compare Umrah packages, Hunza and Skardu tours and international holidays from Pakistan with clear PKR prices per person.",
        lcp: "hunza",
        schema: [breadcrumbSchema(crumbs), itemList]
      }
    ),
    /* @__PURE__ */ jsx(PageHero, { img: "hunza", eyebrow: "Packages", title: "Tour & Umrah packages with clear PKR prices", crumbs: /* @__PURE__ */ jsx(Breadcrumbs, { items: crumbs }), children: /* @__PURE__ */ jsxs("p", { className: "phero__lead", children: [
      "Prices are per person on sharing basis and include taxes. Custom dates? ",
      SITE.shortName,
      " tailors any package."
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "section container", children: [
      /* @__PURE__ */ jsx("div", { className: "filters", role: "tablist", "aria-label": "Filter packages", children: CATS.map((c) => /* @__PURE__ */ jsx("button", { role: "tab", "aria-selected": cat === c, className: `filter ${cat === c ? "is-active" : ""}`, onClick: () => setCat(c), children: c }, c)) }),
      /* @__PURE__ */ jsx("div", { className: "pgrid", children: list.map((p, i) => /* @__PURE__ */ jsx(PackageCard, { p, i }, p.id)) }, cat)
    ] }),
    /* @__PURE__ */ jsx(CtaBand, {})
  ] });
}
function Destination() {
  const { slug } = useParams();
  const d = DESTINATIONS.find((x) => x.slug === slug);
  if (!d) return /* @__PURE__ */ jsx(NotFound, {});
  const crumbs = [{ label: "Home", to: "/" }, { label: "Destinations", to: "/packages" }, { label: d.name, to: `/destinations/${d.slug}` }];
  const faqs = [
    { q: `How much does a ${d.name} tour cost from Pakistan?`, a: `${d.name} packages with Baba Travels start from ${d.from} per person for ${d.days}, including hotels and transport. Private family tours are quoted on request.` },
    { q: `What is the best time to visit ${d.name}?`, a: `${d.best}.` },
    { q: `How do I get to ${d.name}?`, a: `${d.reach}.` }
  ];
  const office = OFFICES[0];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: `${d.name} tour packages from Pakistan (${d.from})`,
        path: `/destinations/${d.slug}`,
        description: d.summary.slice(0, 155),
        image: `/images/hero/${d.img}-1280.webp`,
        lcp: d.img,
        schema: [tripSchema(d), breadcrumbSchema(crumbs), faqSchema(faqs)]
      }
    ),
    /* @__PURE__ */ jsx(PageHero, { img: d.img, eyebrow: d.region, title: `${d.name} tours from Karachi, Lahore & Islamabad`, crumbs: /* @__PURE__ */ jsx(Breadcrumbs, { items: crumbs }), children: /* @__PURE__ */ jsxs("div", { className: "phero__chips", children: [
      /* @__PURE__ */ jsx("span", { className: "chip chip--glass", children: d.days }),
      /* @__PURE__ */ jsxs("span", { className: "chip chip--glass", children: [
        "from ",
        d.from
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "chip chip--glass", children: [
        "Best: ",
        d.best.split(" ")[0]
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "section container detail", children: [
      /* @__PURE__ */ jsxs("div", { className: "detail__main", children: [
        /* @__PURE__ */ jsxs("h2", { className: "detail__h2", children: [
          "How much does a ",
          d.name,
          " trip cost and what’s included?"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "answer answer--boxed", children: d.summary }),
        /* @__PURE__ */ jsx("h2", { className: "detail__h2", children: "Highlights" }),
        /* @__PURE__ */ jsx("ul", { className: "ticks ticks--2", children: d.highlights.map((x) => /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx(Icon, { name: "Sparkles", size: 16 }),
          x
        ] }, x)) }),
        /* @__PURE__ */ jsx("h2", { className: "detail__h2", children: "Sample itinerary" }),
        /* @__PURE__ */ jsx("ol", { className: "itin", children: d.itinerary.map((t, i) => /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsxs("span", { className: "itin__day", children: [
            "Day ",
            i + 1
          ] }),
          /* @__PURE__ */ jsx("span", { children: t })
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "detail__side", children: [
        /* @__PURE__ */ jsx(KeyFacts, { title: `${d.name} at a glance`, facts: [["Duration", d.days], ["Price from", `${d.from} / person`], ["Best time", d.best], ["Getting there", d.reach]] }),
        /* @__PURE__ */ jsxs("div", { className: "office glass", itemScope: true, itemType: "https://schema.org/TravelAgency", children: [
          /* @__PURE__ */ jsxs("h2", { className: "facts__title", children: [
            "Book with our ",
            office.city,
            " office"
          ] }),
          /* @__PURE__ */ jsx("p", { itemProp: "name", children: /* @__PURE__ */ jsxs("strong", { children: [
            "Baba Travels & Tours — ",
            office.city
          ] }) }),
          /* @__PURE__ */ jsxs("p", { itemProp: "address", children: [
            /* @__PURE__ */ jsx(Icon, { name: "MapPin", size: 15 }),
            office.address
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx(Icon, { name: "Phone", size: 15 }),
            /* @__PURE__ */ jsx("a", { href: `tel:${office.phone.replace(/\s/g, "")}`, itemProp: "telephone", children: office.phone })
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx(Icon, { name: "Clock", size: 15 }),
            office.hours
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: `/quote?service=tours&to=${encodeURIComponent(d.name)}`, className: "btn btn--primary btn--block", children: [
          "Plan my ",
          d.name,
          " trip"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "section container faqwrap", children: [
      /* @__PURE__ */ jsx(SectionHead, { eyebrow: "FAQ", title: `${d.name}: questions answered` }),
      /* @__PURE__ */ jsx(Faq, { items: faqs, idPrefix: "dfaq" })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "section", children: [
      /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx(SectionHead, { eyebrow: "Nearby", title: "Travellers also explore" }) }),
      /* @__PURE__ */ jsx("div", { className: "hscroll", children: DESTINATIONS.filter((x) => x.slug !== d.slug).map((x, i) => /* @__PURE__ */ jsx(DestCard, { d: x, i }, x.slug)) })
    ] }),
    /* @__PURE__ */ jsx(CtaBand, {})
  ] });
}
async function submitLead(payload) {
  {
    await new Promise((r) => setTimeout(r, 900));
    return { ok: true, demo: true };
  }
}
function About() {
  const crumbs = [{ label: "Home", to: "/" }, { label: "About", to: "/about" }];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "About Baba Travels & Tours",
        path: "/about",
        description: `${SITE.name} has helped Pakistani families, pilgrims and companies travel since ${SITE.founded}, with offices in Karachi, Lahore and Islamabad.`,
        lcp: "hunza",
        schema: [orgSchema(), breadcrumbSchema(crumbs)]
      }
    ),
    /* @__PURE__ */ jsx(PageHero, { img: "hunza", eyebrow: "About us", title: "We’ve been sending Pakistan around the world since 2010", crumbs: /* @__PURE__ */ jsx(Breadcrumbs, { items: crumbs }) }),
    /* @__PURE__ */ jsx("section", { className: "section container about", children: /* @__PURE__ */ jsxs("div", { className: "about__grid", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "detail__h2", children: "Who is Baba Travels & Tours?" }),
        /* @__PURE__ */ jsxs("p", { className: "answer answer--boxed", children: [
          SITE.name,
          " is a family-run travel agency founded in Karachi in ",
          SITE.founded,
          ". We plan Umrah journeys, northern Pakistan tours, international holidays and business travel for families, pilgrims and companies, and support Pakistanis abroad travelling home from the UK, Gulf and Canada."
        ] }),
        /* @__PURE__ */ jsx("p", { className: "prose", children: "What started as a small ticketing desk is now a team of advisors across three Pakistani cities and partner desks in Dubai, Jeddah and Istanbul. The idea hasn’t changed: answer the phone, explain the price, and stay with travellers until they’re home. " })
      ] }),
      /* @__PURE__ */ jsx(Stats, {})
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "section section--alt", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsx(SectionHead, { eyebrow: "Our promise", title: "What you can hold us to" }),
      /* @__PURE__ */ jsx("ul", { className: "why__list why__list--grid", children: WHY.map((w) => /* @__PURE__ */ jsxs("li", { "data-reveal": true, children: [
        /* @__PURE__ */ jsx("span", { className: "why__icon", children: /* @__PURE__ */ jsx(Icon, { name: w.icon }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { children: w.title }),
          /* @__PURE__ */ jsx("p", { children: w.text })
        ] })
      ] }, w.title)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "section testi", children: /* @__PURE__ */ jsx(Testimonials, {}) }),
    /* @__PURE__ */ jsx(CtaBand, {})
  ] });
}
function Contact() {
  const crumbs = [{ label: "Home", to: "/" }, { label: "Contact", to: "/contact" }];
  const [state, setState] = useState("idle");
  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setState("sending");
    await submitLead({ ...Object.fromEntries(new FormData(form)) });
    setState("sent");
  };
  const localBusinesses = OFFICES.map((o) => ({ "@type": "TravelAgency", name: `${SITE.name} — ${o.city}`, telephone: o.phone, address: { "@type": "PostalAddress", streetAddress: o.address, addressLocality: o.city, addressCountry: o.country === "UAE" ? "AE" : "PK" }, geo: { "@type": "GeoCoordinates", latitude: o.geo[0], longitude: o.geo[1] } }));
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Seo, { title: "Contact us — offices in Karachi, Lahore, Islamabad & Dubai", path: "/contact", description: `Call ${SITE.phone}, WhatsApp 24/7, or visit our offices in Karachi, Lahore, Islamabad and Dubai.`, lcp: "dubai", schema: [breadcrumbSchema(crumbs), ...localBusinesses] }),
    /* @__PURE__ */ jsx(PageHero, { img: "dubai", eyebrow: "Contact", title: "Talk to a real travel advisor", crumbs: /* @__PURE__ */ jsx(Breadcrumbs, { items: crumbs }), children: /* @__PURE__ */ jsxs("div", { className: "phero__ctas", children: [
      /* @__PURE__ */ jsxs("a", { href: waLink(), className: "btn btn--wa btn--lg", children: [
        /* @__PURE__ */ jsx(WhatsAppIcon, {}),
        "WhatsApp 24/7"
      ] }),
      /* @__PURE__ */ jsxs("a", { href: `tel:${SITE.phoneHref}`, className: "btn btn--glass btn--lg", children: [
        /* @__PURE__ */ jsx(Icon, { name: "Phone", size: 18 }),
        SITE.phone
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "section container contact", children: [
      /* @__PURE__ */ jsx("div", { className: "offices", children: OFFICES.map((o, i) => /* @__PURE__ */ jsxs("article", { className: "office glass", "data-reveal": true, style: { "--rd": `${i * 70}ms` }, children: [
        /* @__PURE__ */ jsx("span", { className: "chip", children: o.label }),
        /* @__PURE__ */ jsxs("h2", { className: "office__city", children: [
          o.city,
          /* @__PURE__ */ jsx("small", { children: o.country })
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx(Icon, { name: "MapPin", size: 15 }),
          o.address
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx(Icon, { name: "Phone", size: 15 }),
          /* @__PURE__ */ jsx("a", { href: `tel:${o.phone.replace(/\s/g, "")}`, children: o.phone })
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx(Icon, { name: "Clock", size: 15 }),
          o.hours
        ] }),
        /* @__PURE__ */ jsxs("a", { className: "office__map", href: `https://www.google.com/maps?q=${o.geo[0]},${o.geo[1]}`, target: "_blank", rel: "noopener", children: [
          "Open in Google Maps",
          /* @__PURE__ */ jsx(Icon, { name: "ArrowUpRight", size: 15 })
        ] })
      ] }, o.id)) }),
      /* @__PURE__ */ jsxs("form", { className: "cform glass", onSubmit, noValidate: true, children: [
        /* @__PURE__ */ jsx("h2", { className: "detail__h2", children: "Send us a message" }),
        state === "sent" ? /* @__PURE__ */ jsxs("div", { className: "success", children: [
          /* @__PURE__ */ jsx("span", { className: "success__tick", children: /* @__PURE__ */ jsx(Icon, { name: "Check", size: 28 }) }),
          /* @__PURE__ */ jsx("h3", { children: "Message received" }),
          /* @__PURE__ */ jsx("p", { children: "An advisor will reply by WhatsApp or email within 30 minutes during office hours." })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "cform__row", children: [
            /* @__PURE__ */ jsxs("label", { className: "field", children: [
              /* @__PURE__ */ jsx("span", { className: "field__label", children: "Full name" }),
              /* @__PURE__ */ jsx("input", { name: "name", required: true, autoComplete: "name" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "field", children: [
              /* @__PURE__ */ jsx("span", { className: "field__label", children: "Phone / WhatsApp" }),
              /* @__PURE__ */ jsx("input", { name: "phone", required: true, type: "tel", autoComplete: "tel", placeholder: "+92 3xx xxxxxxx" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "field", children: [
            /* @__PURE__ */ jsx("span", { className: "field__label", children: "Email" }),
            /* @__PURE__ */ jsx("input", { name: "email", type: "email", autoComplete: "email" })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "field", children: [
            /* @__PURE__ */ jsx("span", { className: "field__label", children: "How can we help?" }),
            /* @__PURE__ */ jsx("textarea", { name: "message", rows: "4", required: true })
          ] }),
          /* @__PURE__ */ jsxs("button", { className: "btn btn--primary btn--lg", disabled: state === "sending", children: [
            state === "sending" ? "Sending…" : "Send message",
            /* @__PURE__ */ jsx(Icon, { name: "Send", size: 18 })
          ] })
        ] })
      ] })
    ] })
  ] });
}
const SERVICES = [
  ["flights", "Air tickets", "Plane"],
  ["umrah", "Umrah / Hajj", "Moon"],
  ["tours", "Holiday tour", "Mountain"],
  ["visa", "Visa", "Stamp"],
  ["hotel", "Hotel", "BedDouble"],
  ["car", "Car / transfer", "Car"]
];
const STEPS = ["Service", "Trip", "Travellers", "Contact"];
function Quote() {
  var _a2;
  const { search } = useLocation();
  const pre = useMemo(() => Object.fromEntries(new URLSearchParams(search)), [search]);
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ service: ((_a2 = SERVICES.find(([id]) => id === pre.service)) == null ? void 0 : _a2[0]) || "umrah", from: pre.from || "", to: pre.to || "", date: pre.date || "", adults: "2", children: "0", budget: "Standard", name: "", phone: "", email: "", notes: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }));
  const crumbs = [{ label: "Home", to: "/" }, { label: "Get a quote", to: "/quote" }];
  const validate = () => {
    const e = {};
    if (step === 1 && !data.to.trim()) e.to = "Tell us where you’d like to go";
    if (step === 3) {
      if (!data.name.trim()) e.name = "Please add your name";
      if (!/^[+\d][\d\s-]{8,}$/.test(data.phone.trim())) e.phone = "Enter a valid phone / WhatsApp number";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const nextStep = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    if (step < 3) return setStep(step + 1);
    setStatus("sending");
    try {
      await submitLead({ type: "quote", ...data });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Seo, { title: "Get a free travel quote", path: "/quote", description: "Request a free quote for flights, Umrah, tours, visas, hotels or car rental. Clear PKR prices from a Baba Travels advisor in about 30 minutes.", schema: [breadcrumbSchema(crumbs)] }),
    /* @__PURE__ */ jsxs("section", { className: "quote container", children: [
      /* @__PURE__ */ jsx(Breadcrumbs, { items: crumbs }),
      /* @__PURE__ */ jsxs("div", { className: "quote__grid", children: [
        /* @__PURE__ */ jsxs("div", { className: "quote__intro", children: [
          /* @__PURE__ */ jsx("span", { className: "eyebrow", children: "Free quote" }),
          /* @__PURE__ */ jsxs("h1", { className: "quote__title", children: [
            "Tell us the trip. ",
            /* @__PURE__ */ jsx("em", { children: "We’ll do the rest." })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "answer", children: "Share four quick details and a Baba Travels advisor sends 2–3 options with full PKR prices — usually within 30 minutes during office hours. No booking fee, no obligation." }),
          /* @__PURE__ */ jsxs("a", { href: waLink(), className: "btn btn--wa", children: [
            /* @__PURE__ */ jsx(WhatsAppIcon, {}),
            "Prefer WhatsApp?"
          ] })
        ] }),
        /* @__PURE__ */ jsx("form", { className: "qform glass", onSubmit: nextStep, noValidate: true, children: status === "sent" ? /* @__PURE__ */ jsxs("div", { className: "success", children: [
          /* @__PURE__ */ jsx("span", { className: "success__tick", children: /* @__PURE__ */ jsx(Icon, { name: "Check", size: 30 }) }),
          /* @__PURE__ */ jsxs("h2", { children: [
            "Request received, ",
            data.name.split(" ")[0],
            "!"
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            "We’ll WhatsApp you at ",
            /* @__PURE__ */ jsx("b", { children: data.phone }),
            " with your options shortly."
          ] })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "qprog", "aria-label": `Step ${step + 1} of 4`, children: [
            /* @__PURE__ */ jsx("div", { className: "qprog__bar", children: /* @__PURE__ */ jsx("span", { style: { transform: `scaleX(${(step + 1) / 4})` } }) }),
            /* @__PURE__ */ jsx("ol", { children: STEPS.map((s, i) => /* @__PURE__ */ jsxs("li", { className: i <= step ? "is-done" : "", "aria-current": i === step ? "step" : void 0, children: [
              /* @__PURE__ */ jsx("span", { children: i + 1 }),
              s
            ] }, s)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "qstep", children: [
            step === 0 && /* @__PURE__ */ jsxs("fieldset", { children: [
              /* @__PURE__ */ jsx("legend", { className: "qstep__q", children: "What would you like to book?" }),
              /* @__PURE__ */ jsx("div", { className: "choices", children: SERVICES.map(([id, label, icon]) => /* @__PURE__ */ jsxs("label", { className: `choice ${data.service === id ? "is-on" : ""}`, children: [
                /* @__PURE__ */ jsx("input", { type: "radio", name: "service", value: id, checked: data.service === id, onChange: set("service") }),
                /* @__PURE__ */ jsx(Icon, { name: icon, size: 22 }),
                /* @__PURE__ */ jsx("span", { children: label })
              ] }, id)) })
            ] }),
            step === 1 && /* @__PURE__ */ jsxs("fieldset", { children: [
              /* @__PURE__ */ jsx("legend", { className: "qstep__q", children: "Where and when?" }),
              /* @__PURE__ */ jsxs("div", { className: "cform__row", children: [
                /* @__PURE__ */ jsxs("label", { className: "field", children: [
                  /* @__PURE__ */ jsx("span", { className: "field__label", children: "From" }),
                  /* @__PURE__ */ jsx("input", { value: data.from, onChange: set("from"), placeholder: "Karachi" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: `field ${errors.to ? "has-error" : ""}`, children: [
                  /* @__PURE__ */ jsx("span", { className: "field__label", children: "To *" }),
                  /* @__PURE__ */ jsx("input", { value: data.to, onChange: set("to"), placeholder: "Makkah, Hunza, Dubai…", "aria-invalid": !!errors.to, "aria-describedby": "e-to" }),
                  errors.to && /* @__PURE__ */ jsx("span", { className: "field__err", id: "e-to", children: errors.to })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "field", children: [
                /* @__PURE__ */ jsx("span", { className: "field__label", children: "Travel date" }),
                /* @__PURE__ */ jsx("input", { type: "date", value: data.date, onChange: set("date") })
              ] })
            ] }),
            step === 2 && /* @__PURE__ */ jsxs("fieldset", { children: [
              /* @__PURE__ */ jsx("legend", { className: "qstep__q", children: "Who’s travelling?" }),
              /* @__PURE__ */ jsxs("div", { className: "cform__row", children: [
                /* @__PURE__ */ jsxs("label", { className: "field", children: [
                  /* @__PURE__ */ jsx("span", { className: "field__label", children: "Adults" }),
                  /* @__PURE__ */ jsx("input", { type: "number", min: "1", value: data.adults, onChange: set("adults") })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "field", children: [
                  /* @__PURE__ */ jsx("span", { className: "field__label", children: "Children" }),
                  /* @__PURE__ */ jsx("input", { type: "number", min: "0", value: data.children, onChange: set("children") })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "choices choices--3", children: ["Economy", "Standard", "Premium"].map((b) => /* @__PURE__ */ jsxs("label", { className: `choice ${data.budget === b ? "is-on" : ""}`, children: [
                /* @__PURE__ */ jsx("input", { type: "radio", name: "budget", value: b, checked: data.budget === b, onChange: set("budget") }),
                /* @__PURE__ */ jsx("span", { children: b })
              ] }, b)) })
            ] }),
            step === 3 && /* @__PURE__ */ jsxs("fieldset", { children: [
              /* @__PURE__ */ jsx("legend", { className: "qstep__q", children: "Where should we send options?" }),
              /* @__PURE__ */ jsxs("label", { className: `field ${errors.name ? "has-error" : ""}`, children: [
                /* @__PURE__ */ jsx("span", { className: "field__label", children: "Full name *" }),
                /* @__PURE__ */ jsx("input", { value: data.name, onChange: set("name"), autoComplete: "name", "aria-invalid": !!errors.name }),
                errors.name && /* @__PURE__ */ jsx("span", { className: "field__err", children: errors.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "cform__row", children: [
                /* @__PURE__ */ jsxs("label", { className: `field ${errors.phone ? "has-error" : ""}`, children: [
                  /* @__PURE__ */ jsx("span", { className: "field__label", children: "WhatsApp *" }),
                  /* @__PURE__ */ jsx("input", { value: data.phone, onChange: set("phone"), type: "tel", autoComplete: "tel", placeholder: "+92 3xx xxxxxxx", "aria-invalid": !!errors.phone }),
                  errors.phone && /* @__PURE__ */ jsx("span", { className: "field__err", children: errors.phone })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "field", children: [
                  /* @__PURE__ */ jsx("span", { className: "field__label", children: "Email" }),
                  /* @__PURE__ */ jsx("input", { value: data.email, onChange: set("email"), type: "email", autoComplete: "email" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "field", children: [
                /* @__PURE__ */ jsx("span", { className: "field__label", children: "Anything else?" }),
                /* @__PURE__ */ jsx("textarea", { rows: "3", value: data.notes, onChange: set("notes"), placeholder: "Wheelchair help, hotel distance, budget…" })
              ] })
            ] })
          ] }, step),
          status === "error" && /* @__PURE__ */ jsx("p", { className: "field__err", role: "alert", children: "Couldn’t send — please try again or WhatsApp us." }),
          /* @__PURE__ */ jsxs("div", { className: "qnav", children: [
            step > 0 ? /* @__PURE__ */ jsxs("button", { type: "button", className: "btn btn--ghost", onClick: () => setStep(step - 1), children: [
              /* @__PURE__ */ jsx(Icon, { name: "ChevronLeft", size: 18 }),
              "Back"
            ] }) : /* @__PURE__ */ jsx("span", {}),
            /* @__PURE__ */ jsxs("button", { className: "btn btn--primary btn--lg", disabled: status === "sending", children: [
              step < 3 ? "Continue" : status === "sending" ? "Sending…" : "Get my quote",
              /* @__PURE__ */ jsx(Icon, { name: "ArrowRight", size: 18 })
            ] })
          ] })
        ] }) })
      ] })
    ] })
  ] });
}
function BlogPost() {
  const { slug } = useParams();
  const p = POSTS.find((x) => x.slug === slug);
  if (!p) return /* @__PURE__ */ jsx(NotFound, {});
  const crumbs = [{ label: "Home", to: "/" }, { label: "Guides", to: "/blog/" + POSTS[0].slug }, { label: p.title, to: `/blog/${p.slug}` }];
  const date = new Date(p.updated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Seo, { title: p.title, path: `/blog/${p.slug}`, description: p.excerpt, image: `/images/hero/${p.img}-1280.webp`, lcp: p.img, schema: [articleSchema(p), breadcrumbSchema(crumbs)] }),
    /* @__PURE__ */ jsx(PageHero, { img: p.img, eyebrow: "Travel guide", title: p.title, crumbs: /* @__PURE__ */ jsx(Breadcrumbs, { items: crumbs }), children: /* @__PURE__ */ jsxs("p", { className: "phero__lead byline", children: [
      "By ",
      p.author,
      " · Last updated ",
      /* @__PURE__ */ jsx("time", { dateTime: p.updated, children: date }),
      " · ",
      p.read,
      " read"
    ] }) }),
    /* @__PURE__ */ jsxs("article", { className: "section container article", children: [
      /* @__PURE__ */ jsxs("p", { className: "answer answer--boxed", children: [
        /* @__PURE__ */ jsx("strong", { children: "In short:" }),
        " ",
        p.excerpt,
        " This guide is maintained by the ",
        p.author,
        " and reviewed every season so prices, visa rules and timings stay current."
      ] }),
      /* @__PURE__ */ jsx("h2", { children: "Before you book" }),
      /* @__PURE__ */ jsx("p", { className: "prose", children: "Full article content goes here — write it as short sections with question-style H2s (“How long does…”, “What does it cost…”) so search engines and AI assistants can quote individual answers." }),
      /* @__PURE__ */ jsx("h2", { children: "Need help planning?" }),
      /* @__PURE__ */ jsxs("p", { className: "prose", children: [
        "Our advisors can turn this guide into a priced itinerary. ",
        /* @__PURE__ */ jsx(Link, { to: "/quote", children: "Request a free quote" }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsx(CtaBand, {})
  ] });
}
function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  useRevealAll(pathname);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { id: "main", className: "page", children: /* @__PURE__ */ jsxs(Routes, { children: [
      /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(Home, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/services", element: /* @__PURE__ */ jsx(Services, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/services/:slug", element: /* @__PURE__ */ jsx(ServiceDetail, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/packages", element: /* @__PURE__ */ jsx(Packages, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/destinations/:slug", element: /* @__PURE__ */ jsx(Destination, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/about", element: /* @__PURE__ */ jsx(About, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/contact", element: /* @__PURE__ */ jsx(Contact, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/quote", element: /* @__PURE__ */ jsx(Quote, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/blog/:slug", element: /* @__PURE__ */ jsx(BlogPost, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFound, {}) })
    ] }) }, pathname),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(MobileBar, {}),
    /* @__PURE__ */ jsx(WhatsAppFab, {})
  ] });
}
function render(url) {
  const helmetContext = {};
  const html = renderToString(
    /* @__PURE__ */ jsx(HelmetProvider, { context: helmetContext, children: /* @__PURE__ */ jsx(StaticRouter, { location: url, children: /* @__PURE__ */ jsx(App, {}) }) })
  );
  const { helmet } = helmetContext;
  const head = helmet ? [helmet.title, helmet.meta, helmet.link, helmet.script].map((h) => h.toString()).join("\n") : "";
  return { html, head };
}
export {
  DESTINATIONS,
  FAQS,
  POSTS,
  ROUTES_LIST,
  SERVICES$1 as SERVICES,
  SITE,
  render
};
