--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_Bills_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Bills_status" AS ENUM (
    'pending',
    'paid'
);


ALTER TYPE public."enum_Bills_status" OWNER TO postgres;

--
-- Name: enum_RegisterCars_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_RegisterCars_status" AS ENUM (
    'ingoing',
    'outgoing'
);


ALTER TYPE public."enum_RegisterCars_status" OWNER TO postgres;

--
-- Name: enum_Users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_role" AS ENUM (
    'user',
    'admin'
);


ALTER TYPE public."enum_Users_role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Bills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Bills" (
    id integer NOT NULL,
    "registrationId" integer NOT NULL,
    "entryDateTime" timestamp with time zone NOT NULL,
    "exitDateTime" timestamp with time zone NOT NULL,
    duration numeric(10,2) NOT NULL,
    amount numeric(10,2) NOT NULL,
    status public."enum_Bills_status" DEFAULT 'pending'::public."enum_Bills_status",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Bills" OWNER TO postgres;

--
-- Name: Bills_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Bills_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Bills_id_seq" OWNER TO postgres;

--
-- Name: Bills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Bills_id_seq" OWNED BY public."Bills".id;


--
-- Name: Parkings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Parkings" (
    id integer NOT NULL,
    code character varying(255) NOT NULL,
    "parkingName" character varying(255) NOT NULL,
    "availableSpaces" integer NOT NULL,
    location character varying(255) NOT NULL,
    "chargingFeePerHour" numeric(10,2) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Parkings" OWNER TO postgres;

--
-- Name: Parkings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Parkings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Parkings_id_seq" OWNER TO postgres;

--
-- Name: Parkings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Parkings_id_seq" OWNED BY public."Parkings".id;


--
-- Name: RegisterCars; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RegisterCars" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "plateNumber" character varying(255) NOT NULL,
    "parkingCode" character varying(255) NOT NULL,
    "entryDateTime" timestamp with time zone NOT NULL,
    "exitDateTime" timestamp with time zone,
    "chargedAmount" numeric(10,2) DEFAULT 0 NOT NULL,
    status public."enum_RegisterCars_status" DEFAULT 'ingoing'::public."enum_RegisterCars_status",
    "ticketStatus" boolean DEFAULT false,
    slot character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."RegisterCars" OWNER TO postgres;

--
-- Name: RegisterCars_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."RegisterCars_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."RegisterCars_id_seq" OWNER TO postgres;

--
-- Name: RegisterCars_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."RegisterCars_id_seq" OWNED BY public."RegisterCars".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    "fullName" character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role public."enum_Users_role" DEFAULT 'user'::public."enum_Users_role",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_seq" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: Bills id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bills" ALTER COLUMN id SET DEFAULT nextval('public."Bills_id_seq"'::regclass);


--
-- Name: Parkings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Parkings" ALTER COLUMN id SET DEFAULT nextval('public."Parkings_id_seq"'::regclass);


--
-- Name: RegisterCars id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RegisterCars" ALTER COLUMN id SET DEFAULT nextval('public."RegisterCars_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Data for Name: Bills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Bills" (id, "registrationId", "entryDateTime", "exitDateTime", duration, amount, status, "createdAt", "updatedAt") FROM stdin;
1	1	2025-05-20 12:20:00+02	2025-05-20 12:34:55.702+02	0.25	2.49	pending	2025-05-20 12:53:54.992+02	2025-05-20 12:53:54.992+02
2	3	2025-05-20 13:13:00+02	2025-05-20 13:14:58.174+02	0.03	0.33	pending	2025-05-20 13:15:04.518+02	2025-05-20 13:15:04.518+02
3	7	2025-05-20 13:48:00+02	2025-05-21 09:21:10.438+02	19.55	195.53	pending	2025-05-21 09:21:15.269+02	2025-05-21 09:21:15.269+02
4	8	2025-05-21 09:58:00+02	2025-05-21 10:00:49.299+02	0.05	2.35	pending	2025-05-21 10:01:08.589+02	2025-05-21 10:01:08.589+02
\.


--
-- Data for Name: Parkings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Parkings" (id, code, "parkingName", "availableSpaces", location, "chargingFeePerHour", "createdAt", "updatedAt") FROM stdin;
1	ST123	SP Gikondo	30	Gikondo	10.00	2025-05-20 12:03:05.81+02	2025-05-20 12:04:42.76+02
3	ST124	SP Remera	20	Remera	20.00	2025-05-20 12:05:04.906+02	2025-05-20 12:05:04.906+02
4	ST456	rca	10	Nyabihu	50.00	2025-05-21 09:58:07.738+02	2025-05-21 09:58:07.738+02
\.


--
-- Data for Name: RegisterCars; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RegisterCars" (id, "userId", "plateNumber", "parkingCode", "entryDateTime", "exitDateTime", "chargedAmount", status, "ticketStatus", slot, "createdAt", "updatedAt") FROM stdin;
1	1	RAA123L	ST123	2025-05-20 12:20:00+02	2025-05-20 12:34:55.702+02	2.49	outgoing	t	A1	2025-05-20 12:20:30.959+02	2025-05-20 12:34:55.703+02
3	1	RAA123D	ST123	2025-05-20 13:13:00+02	2025-05-20 13:14:58.174+02	0.33	outgoing	t	A1	2025-05-20 13:13:57.109+02	2025-05-20 13:14:58.174+02
6	1	RAA123P	ST123	2025-05-20 13:17:00+02	\N	0.00	ingoing	f	\N	2025-05-20 13:17:10.629+02	2025-05-20 13:49:13.511+02
7	1	RAA123L	ST123	2025-05-20 13:48:00+02	2025-05-21 09:21:10.438+02	195.53	outgoing	t	A1	2025-05-20 13:48:59.335+02	2025-05-21 09:21:10.438+02
8	3	RAA123L	ST456	2025-05-21 09:58:00+02	2025-05-21 10:00:49.299+02	2.35	outgoing	t	A1	2025-05-21 09:59:13.525+02	2025-05-21 10:00:49.299+02
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, "fullName", email, password, role, "createdAt", "updatedAt") FROM stdin;
1	test	test@gmail.com	$2b$10$7wOW2lhBqO7Rn23696G2IelXTXKTi9n4QxGMWivVKt.hL7zz8lvr2	user	2025-05-20 11:52:13.513+02	2025-05-20 11:52:13.513+02
2	admin	admin@gmail.com	$2b$10$9BYqfeY1vo4HYKYpUSIzCO/EYUX0hlVU0f2d4hnKy1nHS8lA4/Mp6	admin	2025-05-20 11:52:16.037+02	2025-05-20 11:52:16.037+02
3	Celestin	celestin@gmail.com	$2b$10$IcmaoKfXXurfKC/J9eWDrOqmPCoPjVKAtnacCXlsQS/KnFVa270Zm	user	2025-05-21 09:54:41.135+02	2025-05-21 09:54:41.135+02
4	admin2	admin2@gmail.com	$2b$10$2uiGNLVHy0yCuXoYlovjnuz7NsNPllm4.mWu3WGb5uFYLtQIr4SQe	admin	2025-05-21 09:56:18.146+02	2025-05-21 09:57:15.625+02
\.


--
-- Name: Bills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Bills_id_seq"', 4, true);


--
-- Name: Parkings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Parkings_id_seq"', 4, true);


--
-- Name: RegisterCars_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."RegisterCars_id_seq"', 8, true);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_id_seq"', 4, true);


--
-- Name: Bills Bills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bills"
    ADD CONSTRAINT "Bills_pkey" PRIMARY KEY (id);


--
-- Name: Parkings Parkings_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Parkings"
    ADD CONSTRAINT "Parkings_code_key" UNIQUE (code);


--
-- Name: Parkings Parkings_code_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Parkings"
    ADD CONSTRAINT "Parkings_code_key1" UNIQUE (code);


--
-- Name: Parkings Parkings_code_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Parkings"
    ADD CONSTRAINT "Parkings_code_key2" UNIQUE (code);


--
-- Name: Parkings Parkings_code_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Parkings"
    ADD CONSTRAINT "Parkings_code_key3" UNIQUE (code);


--
-- Name: Parkings Parkings_code_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Parkings"
    ADD CONSTRAINT "Parkings_code_key4" UNIQUE (code);


--
-- Name: Parkings Parkings_code_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Parkings"
    ADD CONSTRAINT "Parkings_code_key5" UNIQUE (code);


--
-- Name: Parkings Parkings_code_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Parkings"
    ADD CONSTRAINT "Parkings_code_key6" UNIQUE (code);


--
-- Name: Parkings Parkings_code_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Parkings"
    ADD CONSTRAINT "Parkings_code_key7" UNIQUE (code);


--
-- Name: Parkings Parkings_code_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Parkings"
    ADD CONSTRAINT "Parkings_code_key8" UNIQUE (code);


--
-- Name: Parkings Parkings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Parkings"
    ADD CONSTRAINT "Parkings_pkey" PRIMARY KEY (id);


--
-- Name: RegisterCars RegisterCars_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RegisterCars"
    ADD CONSTRAINT "RegisterCars_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key1" UNIQUE (email);


--
-- Name: Users Users_email_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key2" UNIQUE (email);


--
-- Name: Users Users_email_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key3" UNIQUE (email);


--
-- Name: Users Users_email_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key4" UNIQUE (email);


--
-- Name: Users Users_email_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key5" UNIQUE (email);


--
-- Name: Users Users_email_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key6" UNIQUE (email);


--
-- Name: Users Users_email_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key7" UNIQUE (email);


--
-- Name: Users Users_email_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key8" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: Bills Bills_registrationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bills"
    ADD CONSTRAINT "Bills_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES public."RegisterCars"(id) ON UPDATE CASCADE;


--
-- Name: RegisterCars RegisterCars_parkingCode_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RegisterCars"
    ADD CONSTRAINT "RegisterCars_parkingCode_fkey" FOREIGN KEY ("parkingCode") REFERENCES public."Parkings"(code) ON UPDATE CASCADE;


--
-- Name: RegisterCars RegisterCars_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RegisterCars"
    ADD CONSTRAINT "RegisterCars_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE;


--
-- PostgreSQL database dump complete
--

