class JsonSerializableMap extends Map {
    toJSON() {
        return [...this.entries()]
    }
    
    static fromJSON(mapFromJson) {
        return new JsonSerializableMap(mapFromJson);
    }
}

export default JsonSerializableMap;