CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS pointcloud WITH SCHEMA public;
COMMENT ON EXTENSION pointcloud IS 'data type for lidar point clouds';
CREATE EXTENSION IF NOT EXISTS pointcloud_postgis WITH SCHEMA public;
COMMENT ON EXTENSION pointcloud_postgis IS 'integration for pointcloud LIDAR data and PostGIS geometry data';

CREATE SCHEMA tiger;
CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder WITH SCHEMA tiger;

CREATE SCHEMA topology;
COMMENT ON SCHEMA topology IS 'PostGIS Topology schema';
CREATE EXTENSION IF NOT EXISTS postgis_topology WITH SCHEMA topology;


CREATE TABLE public.entities (
    ogc_fid integer NOT NULL,
    layer character varying,
    paperspace boolean,
    subclasses character varying,
    linetype character varying,
    entityhandle character varying,
    text character varying,
    wkb_geometry public.geometry
);


CREATE TABLE public.grzegorzecka (
    ogc_fid integer NOT NULL,
    layer character varying,
    paperspace boolean,
    subclasses character varying,
    linetype character varying,
    entityhandle character varying,
    text character varying,
    wkb_geometry public.geometry
);

CREATE TABLE public.powstancow (
    ogc_fid integer NOT NULL,
    layer character varying,
    paperspace boolean,
    subclasses character varying,
    linetype character varying,
    entityhandle character varying,
    text character varying,
    wkb_geometry public.geometry
);

CREATE SEQUENCE public.entities_ogc_fid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.entities_ogc_fid_seq OWNED BY public.entities.ogc_fid;


CREATE SEQUENCE public.grzegorzecka_ogc_fid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.grzegorzecka_ogc_fid_seq OWNED BY public.grzegorzecka.ogc_fid;

CREATE SEQUENCE public.powstancow_ogc_fid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.powstancow_ogc_fid_seq OWNED BY public.powstancow.ogc_fid;