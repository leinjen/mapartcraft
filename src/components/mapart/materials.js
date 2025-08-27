import React, { Component } from "react";

import Tooltip from "../tooltip";

import BlockImage from "./blockImage";

import MapModes from "./json/mapModes.json";

import "./materials.css";

class Materials extends Component {
  state = { onlyMaxPerSplit: false, perLayerRange: false, layersMin: 0, layersMax: 0, mapCol: 0, mapRow: 0};

  onOnlyMaxPerSplitChange = () => {
    this.setState((currentState) => ({
      onlyMaxPerSplit: !currentState.onlyMaxPerSplit,
      perLayerRange: false,
    }));
  };

  onPerLayerChange = () => {
    const isStaggered = this.getIsStaggeredStaircasing();

    if (!isStaggered) {
      this.setState({ perLayerRange: false });
      return;
    }

    this.setState((prev) => ({ 
      perLayerRange: !prev.perLayerRange,
      onlyMaxPerSplit: false, 
    }));
  };

  onPerLayerChangeDisabled = () => {
    this.setState((currentState) => ({
      perLayerRange: false,
    }));
  };

  onOptionChange_layersMin = (e) => {
    const lNum = parseInt(e.target.value);
    this.setState({ layersMin: lNum });
  };

  onOptionChange_layersMax = (e) => {
    const lNum = parseInt(e.target.value);
    this.setState({ layersMax: lNum });
  };

  onOptionChange_mapCol = (e) => {
    const cNum = parseInt(e.target.value);
    this.setState({ mapCol: cNum });
  };

  onOptionChange_mapRow = (e) => {
    const rNum = parseInt(e.target.value);
    this.setState({ mapRow: rNum });
  };

  getMaxMapCol() {
    const {currentMaterialsData} = this.props;
    return currentMaterialsData.maps[0].length - 1;
  }

  getMaxMapRow() {
    const {currentMaterialsData} = this.props;
    return currentMaterialsData.maps.length - 1;
  }

  componentDidUpdate(prevProps) {
    const {perLayerRange, mapCol, mapRow} = this.state;
    const isStaggered = this.getIsStaggeredStaircasing();
    const maxMapCol = this.getMaxMapCol();
    const maxMapRow = this.getMaxMapRow();

    if (!isStaggered && perLayerRange) {
      this.setState({ perLayerRange: false });
    }

    if (mapCol > maxMapCol && mapCol !== 0) {
      this.setState({ mapCol: 0 });
    }

    if (mapRow > maxMapRow && mapRow !== 0) {
      this.setState({ mapRow: 0 });
    }
  }

  getIsStaggeredStaircasing() {
    const {optionValue_staircasing } = this.props;
    let retVal = false;
    switch (optionValue_staircasing) {
      case MapModes.SCHEMATIC_NBT.staircaseModes.STAGGERED_WE_871.uniqueId:
      case MapModes.SCHEMATIC_NBT.staircaseModes.STAGGERED_EW_27.uniqueId:
      case MapModes.SCHEMATIC_NBT.staircaseModes.STAGGERED_EW_87.uniqueId: {
        retVal = true;
        break;
      }
      default: {
        retVal = false;
      }
    }
    return retVal;
  }

  getMaxStaggeredLayer() {
    const {optionValue_staircasing } = this.props;
    let retVal = 0;
    switch (optionValue_staircasing) {
      case MapModes.SCHEMATIC_NBT.staircaseModes.STAGGERED_WE_871.uniqueId: 
      case MapModes.SCHEMATIC_NBT.staircaseModes.STAGGERED_EW_87.uniqueId: {
        let layerColumns = [8,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,1];
        retVal = layerColumns.length - 1;
        break;
      }
      case MapModes.SCHEMATIC_NBT.staircaseModes.STAGGERED_EW_27.uniqueId: {
        let layerColumns = [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,2];
        retVal = layerColumns.length - 1;
        break;
      }
      default: {
        retVal = 0;
      }
    }
    return retVal;
  }

  staggeredLayersIniEndMapRowCol() {
    const {optionValue_staircasing } = this.props;
    const {layersMin, layersMax} = this.state;
    const maxLayer = this.getMaxStaggeredLayer();
    let retVal = [-1,-1]; // ini/end map Col/Row ([-1,-1] is non valid)

    if ((layersMin >= 0) && (layersMin <= maxLayer) &&
        (layersMax >= 0) && (layersMax <= maxLayer)) {

      // Get Stagger Layers array
      let layerColumns = []

      switch (optionValue_staircasing) {
        case MapModes.SCHEMATIC_NBT.staircaseModes.STAGGERED_WE_871.uniqueId: 
        case MapModes.SCHEMATIC_NBT.staircaseModes.STAGGERED_EW_87.uniqueId: {
          layerColumns = [8,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,1];
          break;
        }
        case MapModes.SCHEMATIC_NBT.staircaseModes.STAGGERED_EW_27.uniqueId: {
          layerColumns = [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,2];
          break;
        }
        default: {
          // non valid stagger option
          return [-1,-1];
        }
      }

      // Calculate which layers to add from the stagger array
      let i_st = layersMin; // Stagger Array start index
      let e_st = layersMax; // Stagger Array end index

      if (layersMin > layersMax) {
        i_st = layersMax;
        e_st = layersMin;
      }

      // calculate ini map col/row
      let iniMap = 0;

      if (i_st !== 0) {
        for (let i = 0; i < i_st; i++) {
          iniMap += layerColumns[i];
        }
      }

      // calculate end map col/row
      let endMap = iniMap;

      for (let i = i_st; i <= e_st; i++) {
        endMap += layerColumns[i];
      }


      retVal = [iniMap, endMap];
      
    }

    return retVal;
  }

  getMaterialsCount_nonZeroMaterialsItems() {
    const { coloursJSON, currentMaterialsData } = this.props;
    const { onlyMaxPerSplit, perLayerRange, layersMin, layersMax, mapCol, mapRow} = this.state;
    const materialsCount = {};
    const maxMapCol = this.getMaxMapCol();
    const maxMapRow = this.getMaxMapRow();

    for (const colourSetId of Object.keys(coloursJSON)) {
      materialsCount[colourSetId] = 0;
    }


    if (perLayerRange && this.getIsStaggeredStaircasing() && 
      (mapCol <= maxMapCol) && (mapRow <= maxMapRow) &&
      (layersMin >= 0) && (layersMax >= 0) ) {

      const iniEndMap = this.staggeredLayersIniEndMapRowCol();
      let iniMapColRow = iniEndMap[0];
      let endMapColRow = iniEndMap[1];

      let exactColourCache = new Map();

      for (const [colourSetId, colourSet] of Object.entries(coloursJSON)) {
        for (const [toneKey, toneRGB] of Object.entries(colourSet.tonesRGB)) {
          const RGBBinary = (toneRGB[0] << 16) + (toneRGB[1] << 8) + toneRGB[2];
          exactColourCache.set(RGBBinary, {
            colourSetId: colourSetId,
            tone: toneKey,
          });
        }
      }

      let pixelsData_offset = 0;
      let RGBBinary = 0;
      let colourSetIdAndTone = {
            colourSetId: 0,
            tone: 0,
      };

      // TODO NOTE: if ever we get a staggered oriented South-North, the iniEndMap will use ROWS instead of Columns
      for (let columnNumber = iniMapColRow; columnNumber < endMapColRow; columnNumber++) {
        for (let rowNumber = 0; rowNumber < 128; rowNumber++) {
          pixelsData_offset = 4 * (128 * (maxMapCol+1) * (128 * mapRow + rowNumber) + 128 * mapCol + columnNumber);
          RGBBinary = (currentMaterialsData.pixelsData[pixelsData_offset] << 16) + 
                      (currentMaterialsData.pixelsData[pixelsData_offset + 1] << 8) + 
                      currentMaterialsData.pixelsData[pixelsData_offset + 2];

          if (exactColourCache.has(RGBBinary)) {
            colourSetIdAndTone = exactColourCache.get(RGBBinary);
            materialsCount[colourSetIdAndTone.colourSetId] += 1;
          }
          
          //console.log("mapCol", columnNumber, "mapRow", rowNumber, "PixOffset", pixelsData_offset, "colorID", colourSetIdAndTone.colourSetId);
        }
      }
    }
    else{
      for (const row of currentMaterialsData.maps) {
        for (const map of row) {
          for (const [colourSetId, materialCount] of Object.entries(map.materials)) {
            if (onlyMaxPerSplit) {
              materialsCount[colourSetId] = Math.max(materialsCount[colourSetId], materialCount);
            } else {
              materialsCount[colourSetId] += materialCount;
            }
          }
        }
      }
    } 
    
    return Object.entries(materialsCount)
      .filter(([_, value]) => value !== 0)
      .sort((first, second) => {
        return second[1] - first[1];
      });
  }

  getMaterialsCount_supportBlock() {
    const { currentMaterialsData } = this.props;
    const { onlyMaxPerSplit } = this.state;
    let supportBlockCount = 0;
    currentMaterialsData.maps.forEach((row) => {
      row.forEach((map) => {
        const count = map.supportBlockCount;
        if (onlyMaxPerSplit) {
          supportBlockCount = Math.max(supportBlockCount, count);
        } else {
          supportBlockCount += count;
        }
      });
    });
    return supportBlockCount;
  }

  formatMaterialCount = (count) => {
    if (count < 64) return '' + count;

    const numberOfShulkers = Math.floor(count / 1728);
    const numberOfStacks = Math.floor((count % 1728) / 64);
    const remainder = count % 64;

    const sb = numberOfShulkers > 0 ? `${numberOfShulkers} B` : "";
    const stacks = numberOfStacks > 0 ? `${numberOfStacks} S` : "";
    const items = remainder > 0 ? `${remainder} I`: "";

    const split = [sb, stacks, items].filter(n => n).join(' + ');

    return `${count.toString()} (${split})`;
  };

  colourSetIdAndBlockIdFromNBTName(blockName) {
    const { coloursJSON, optionValue_version } = this.props;
    for (const [colourSetId, colourSet] of Object.entries(coloursJSON)) {
      for (const [blockId, block] of Object.entries(colourSet.blocks)) {
        if (!(optionValue_version.MCVersion in block.validVersions)) {
          continue;
        }
        let blockNBTData = block.validVersions[optionValue_version.MCVersion];
        if (typeof blockNBTData === "string") {
          // this is of the form eg "&1.12.2"
          blockNBTData = block.validVersions[blockNBTData.slice(1)];
        }
        if (
          Object.keys(blockNBTData.NBTArgs).length === 0 && // no exotic blocks for noobline
          blockName.toLowerCase() === blockNBTData.NBTName.toLowerCase()
        ) {
          return { colourSetId, blockId };
        }
      }
    }
    return null; // if block not found
  }

  nbtNameToColourSetId(colourSetId) {
    const { coloursJSON, optionValue_version, currentMaterialsData } = this.props;
    const colourSet = coloursJSON[colourSetId];
    const selection = currentMaterialsData.currentSelectedBlocks[colourSetId];

    if (selection < 0) return null;

    const block = colourSet.blocks[selection];
    if (!(optionValue_version.MCVersion in block.validVersions)) {
      return null;
    }
    let blockNBTData = block.validVersions[optionValue_version.MCVersion];

    if (typeof blockNBTData === "string") {
      // this is of the form eg "&1.12.2"
      blockNBTData = block.validVersions[blockNBTData.slice(1)];
    }

    return blockNBTData.NBTName.toLowerCase();
  }

  copyToClipboard(nonZeroMaterialsItems, supportBlockCount) {
    const { optionValue_supportBlock} = this.props;

    const mergedList = new Array(nonZeroMaterialsItems.length);

    for (const [colourSetId, val] of Object.values(nonZeroMaterialsItems)) {
      const mcId = this.nbtNameToColourSetId(colourSetId);
      mergedList[mcId] = val;
    }

    mergedList[optionValue_supportBlock] += supportBlockCount;

    const counts = Object.fromEntries(
      Object.entries(mergedList.sort((first, second) => second - first))
      .map(([k, v]) => [k, this.formatMaterialCount(v)]));

    const NBSP = String.fromCharCode(160); //non-breaking space
    const CRLF = String.fromCharCode(13, 10); //new line

    const results = ["```"];

    //calculate paddings
    let nameMaxLength = 0;

    for (const key of Object.keys(counts)) {
      if (nameMaxLength < key.length)
        nameMaxLength = key.length;
    }

    //insert each entry
    for (const [key, val] of Object.entries(counts)) {
      results.push(key.padEnd(nameMaxLength, NBSP) + " = " + val);
    }

    results.push("```");

    navigator.clipboard.writeText(results.join(CRLF));
  }

  render() {
    const { getLocaleString, coloursJSON, optionValue_supportBlock, currentMaterialsData, onChangeColourSetBlock } = this.props;
    const { onlyMaxPerSplit, perLayerRange, layersMin, layersMax, mapCol, mapRow} = this.state;
    const nonZeroMaterialsItems = this.getMaterialsCount_nonZeroMaterialsItems();
    const supportBlockCount = this.getMaterialsCount_supportBlock();
    const supportBlockIds = this.colourSetIdAndBlockIdFromNBTName(optionValue_supportBlock);
    const maxStaggeredLayer = this.getMaxStaggeredLayer()
    const isStaggered = this.getIsStaggeredStaircasing();
    const maxMapCol = this.getMaxMapCol();
    const maxMapRow = this.getMaxMapRow();

    return (
      <div className="section materialsDiv">
        <h2>{getLocaleString("MATERIALS/TITLE")}</h2>
        <Tooltip tooltipText={getLocaleString("MATERIALS/SHOW-PER-SPLIT-TT")}>
          <b>
            {getLocaleString("MATERIALS/SHOW-PER-SPLIT")}
            {":"}
          </b>
        </Tooltip>{" "}
        <input type="checkbox" checked={onlyMaxPerSplit} onChange={this.onOnlyMaxPerSplitChange} />
        <br />
        <Tooltip tooltipText={getLocaleString("MATERIALS/SHOW-PER-LAYER-TT")}>
          <b>
            {getLocaleString("MATERIALS/SHOW-PER-LAYER")}
            {":"}
          </b>
        </Tooltip>{" "}
        <input type="checkbox" checked={perLayerRange} onChange={this.onPerLayerChange} disabled={!isStaggered} />
        <br />
        <Tooltip tooltipText={"Range of layers to show (Layer 0 is the lowest in height)"}>
          <b>
            {"From-to Layer"}
            {":"}
          </b>
        </Tooltip>{" "}
        <select
          onChange={this.onOptionChange_layersMin}
          value={layersMin}
          disabled={!perLayerRange}
        >
          {Array.from({ length: maxStaggeredLayer + 1 }, (_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
        <b> {" - "} </b>
        <select
          onChange={this.onOptionChange_layersMax}
          value={layersMax}
          disabled={!perLayerRange}
        >
          {Array.from({ length: maxStaggeredLayer + 1 }, (_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
        <br />
        <Tooltip tooltipText={"Map to show"}>
          <b>
            {"MAP"}
            {":"}
          </b>
        </Tooltip>{" "}
        <select
          onChange={this.onOptionChange_mapCol}
          value={mapCol}
          disabled={!perLayerRange}
        >
          {Array.from({ length: maxMapCol + 1 }, (_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
        <b> {"_"} </b>
        <select
          onChange={this.onOptionChange_mapRow}
          value={mapRow}
          disabled={!perLayerRange}
        >
          {Array.from({ length: maxMapRow + 1 }, (_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
        <br />
        <button type="button" onClick={() => this.copyToClipboard(nonZeroMaterialsItems, supportBlockCount)}>{getLocaleString("MATERIALS/COPY-CLIPBOARD")}</button>
        <table id="materialtable">
          <tbody>
            <tr>
              <th>{getLocaleString("MATERIALS/BLOCK")}</th>
              <th>{getLocaleString("MATERIALS/AMOUNT")}</th>
            </tr>
            {supportBlockCount !== 0 && (
              <tr>
                <th>
                  <Tooltip tooltipText={getLocaleString("MATERIALS/PLACEHOLDER-BLOCK-TT")}>
                    <BlockImage
                      getLocaleString={getLocaleString}
                      coloursJSON={coloursJSON}
                      colourSetId={supportBlockIds === null ? "64" : supportBlockIds.colourSetId}
                      blockId={supportBlockIds === null ? "2" : supportBlockIds.blockId}
                    />
                  </Tooltip>
                </th>
                <th>{this.formatMaterialCount(supportBlockCount)}</th>
              </tr>
            )}
            {nonZeroMaterialsItems.map(([colourSetId, materialCount]) => {
              const blockId = currentMaterialsData.currentSelectedBlocks[colourSetId];
              return (
                <tr key={colourSetId}>
                  <th>
                    <Tooltip tooltipText={coloursJSON[colourSetId].blocks[blockId].displayName}>
                      <BlockImage coloursJSON={coloursJSON} colourSetId={colourSetId} blockId={blockId} />
                    </Tooltip>
                    <Tooltip tooltipText={getLocaleString("NONE")}>
                      <BlockImage
                        getLocaleString={getLocaleString}
                        coloursJSON={coloursJSON}
                        colourSetId={colourSetId}
                        blockId={"-1"}
                        onClick={() => onChangeColourSetBlock(colourSetId, "-1")}
                        style={{
                          cursor: "pointer"
                        }}
                      />
                    </Tooltip>
                  </th>
                  <th>{this.formatMaterialCount(materialCount)}</th>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Materials;
