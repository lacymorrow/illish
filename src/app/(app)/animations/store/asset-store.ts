import { create, type GetState, type SetState } from "zustand";
import { type AnimationTemplate } from "../types";

interface Asset {
    id: string;
    name: string;
    type: "image" | "video" | "audio" | "font" | "color";
    url: string;
    thumbnailUrl?: string;
    metadata?: {
        size?: number;
        duration?: number;
        dimensions?: {
            width: number;
            height: number;
        };
        format?: string;
        [key: string]: unknown;
    };
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

interface AssetCollection {
    id: string;
    name: string;
    description?: string;
    assets: string[]; // Asset IDs
    type: "brand" | "project" | "template" | "shared";
    createdAt: Date;
    updatedAt: Date;
}

interface AssetStore {
    assets: Asset[];
    collections: AssetCollection[];
    templates: AnimationTemplate[];
    selectedAsset: Asset | null;
    selectedCollection: AssetCollection | null;
    // Asset operations
    addAsset: (asset: Asset) => void;
    updateAsset: (asset: Asset) => void;
    deleteAsset: (assetId: string) => void;
    selectAsset: (asset: Asset | null) => void;
    // Collection operations
    addCollection: (collection: AssetCollection) => void;
    updateCollection: (collection: AssetCollection) => void;
    deleteCollection: (collectionId: string) => void;
    selectCollection: (collection: AssetCollection | null) => void;
    addAssetToCollection: (assetId: string, collectionId: string) => void;
    removeAssetFromCollection: (assetId: string, collectionId: string) => void;
    // Template operations
    addTemplate: (template: AnimationTemplate) => void;
    updateTemplate: (template: AnimationTemplate) => void;
    deleteTemplate: (templateId: string) => void;
    // Queries
    getAssetsByType: (type: Asset["type"]) => Asset[];
    getAssetsByTags: (tags: string[]) => Asset[];
    getCollectionAssets: (collectionId: string) => Asset[];
    searchAssets: (query: string) => Asset[];
}

export const useAssetStore = create<AssetStore>(
    (set: SetState<AssetStore>, get: GetState<AssetStore>) => ({
        assets: [],
        collections: [],
        templates: [],
        selectedAsset: null,
        selectedCollection: null,

        // Asset operations
        addAsset: (asset: Asset) =>
            set((state) => ({ assets: [...state.assets, asset] })),
        updateAsset: (asset: Asset) =>
            set((state) => ({
                assets: state.assets.map((a) => (a.id === asset.id ? asset : a)),
            })),
        deleteAsset: (assetId: string) =>
            set((state) => ({
                assets: state.assets.filter((a) => a.id !== assetId),
                collections: state.collections.map((c) => ({
                    ...c,
                    assets: c.assets.filter((id) => id !== assetId),
                })),
            })),
        selectAsset: (asset: Asset | null) => set({ selectedAsset: asset }),

        // Collection operations
        addCollection: (collection: AssetCollection) =>
            set((state) => ({
                collections: [...state.collections, collection],
            })),
        updateCollection: (collection: AssetCollection) =>
            set((state) => ({
                collections: state.collections.map((c) =>
                    c.id === collection.id ? collection : c,
                ),
            })),
        deleteCollection: (collectionId: string) =>
            set((state) => ({
                collections: state.collections.filter((c) => c.id !== collectionId),
            })),
        selectCollection: (collection: AssetCollection | null) =>
            set({ selectedCollection: collection }),
        addAssetToCollection: (assetId: string, collectionId: string) =>
            set((state) => ({
                collections: state.collections.map((c) =>
                    c.id === collectionId && !c.assets.includes(assetId)
                        ? { ...c, assets: [...c.assets, assetId] }
                        : c,
                ),
            })),
        removeAssetFromCollection: (assetId: string, collectionId: string) =>
            set((state) => ({
                collections: state.collections.map((c) =>
                    c.id === collectionId
                        ? { ...c, assets: c.assets.filter((id) => id !== assetId) }
                        : c,
                ),
            })),

        // Template operations
        addTemplate: (template: AnimationTemplate) =>
            set((state) => ({ templates: [...state.templates, template] })),
        updateTemplate: (template: AnimationTemplate) =>
            set((state) => ({
                templates: state.templates.map((t) =>
                    t.id === template.id ? template : t,
                ),
            })),
        deleteTemplate: (templateId: string) =>
            set((state) => ({
                templates: state.templates.filter((t) => t.id !== templateId),
            })),

        // Queries
        getAssetsByType: (type: Asset["type"]) =>
            get().assets.filter((a) => a.type === type),
        getAssetsByTags: (tags: string[]) =>
            get().assets.filter((a) => tags.some((tag) => a.tags.includes(tag))),
        getCollectionAssets: (collectionId: string) => {
            const collection = get().collections.find((c) => c.id === collectionId);
            return collection
                ? get().assets.filter((a) => collection.assets.includes(a.id))
                : [];
        },
        searchAssets: (query: string) => {
            const lowercaseQuery = query.toLowerCase();
            return get().assets.filter(
                (a) =>
                    a.name.toLowerCase().includes(lowercaseQuery) ||
                    a.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
            );
        },
    }),
);
