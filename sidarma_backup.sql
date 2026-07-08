--
-- PostgreSQL database dump
--

\restrict gWiBtyQBhAVI4o6nOLGZYlelWQc2B2v9WsAaIOUYl25dC4x1fe1oTbAWWvnmVTx

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: BaleClothType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BaleClothType" AS ENUM (
    'PUTIH',
    'WARNA'
);


ALTER TYPE public."BaleClothType" OWNER TO postgres;

--
-- Name: BaleGrade; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BaleGrade" AS ENUM (
    'A1',
    'B2',
    'C3'
);


ALTER TYPE public."BaleGrade" OWNER TO postgres;

--
-- Name: BongkaranStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BongkaranStatus" AS ENUM (
    'PENDING_SORT',
    'IN_PROGRESS',
    'SORTED',
    'CANCELLED'
);


ALTER TYPE public."BongkaranStatus" OWNER TO postgres;

--
-- Name: InventoryMovementType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InventoryMovementType" AS ENUM (
    'INBOUND',
    'OUTBOUND'
);


ALTER TYPE public."InventoryMovementType" OWNER TO postgres;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'UNPAID',
    'PARTIAL',
    'PAID'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'USER'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Article; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Article" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    category text DEFAULT 'Blog'::text NOT NULL,
    thumbnail text,
    "isPublished" boolean DEFAULT false NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Article" OWNER TO postgres;

--
-- Name: BalePrice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BalePrice" (
    id text NOT NULL,
    "clothType" public."BaleClothType" NOT NULL,
    grade public."BaleGrade" NOT NULL,
    "pricePerBal" numeric(14,2) NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."BalePrice" OWNER TO postgres;

--
-- Name: Bongkaran; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Bongkaran" (
    id text NOT NULL,
    "konveksiId" text NOT NULL,
    "purchaseDate" timestamp(3) without time zone NOT NULL,
    "quantityKg" numeric(12,2) NOT NULL,
    "pricePerKg" numeric(14,2) NOT NULL,
    subtotal numeric(14,2) NOT NULL,
    "transportExpense" numeric(14,2) DEFAULT 0 NOT NULL,
    "additionalExpense" numeric(14,2) DEFAULT 0 NOT NULL,
    "totalCost" numeric(14,2) NOT NULL,
    "costPerKgEffective" numeric(14,4) NOT NULL,
    "sortedQuantityKg" numeric(12,2) DEFAULT 0 NOT NULL,
    status public."BongkaranStatus" DEFAULT 'PENDING_SORT'::public."BongkaranStatus" NOT NULL,
    notes text,
    "createdById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Bongkaran" OWNER TO postgres;

--
-- Name: BongkaranSort; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BongkaranSort" (
    id text NOT NULL,
    "bongkaranId" text NOT NULL,
    "sortDate" timestamp(3) without time zone NOT NULL,
    "inputKg" numeric(12,2) NOT NULL,
    "outputPutihKg" numeric(12,2) NOT NULL,
    "outputWarnaKg" numeric(12,2) NOT NULL,
    "wasteKg" numeric(12,2) NOT NULL,
    "laborExpense" numeric(14,2) DEFAULT 0 NOT NULL,
    "totalCost" numeric(14,2) NOT NULL,
    "unitCostPutih" numeric(14,4) DEFAULT 0 NOT NULL,
    "unitCostWarna" numeric(14,4) DEFAULT 0 NOT NULL,
    notes text,
    "createdById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."BongkaranSort" OWNER TO postgres;

--
-- Name: CareerApplication; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CareerApplication" (
    id text NOT NULL,
    "postId" text NOT NULL,
    "fullName" text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    "coverLetter" text,
    status text DEFAULT 'Pending'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CareerApplication" OWNER TO postgres;

--
-- Name: CareerPost; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CareerPost" (
    id text NOT NULL,
    title text NOT NULL,
    department text NOT NULL,
    location text DEFAULT 'Bandung, Jawa Barat'::text NOT NULL,
    type text DEFAULT 'Full-time'::text NOT NULL,
    description text NOT NULL,
    requirements text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CareerPost" OWNER TO postgres;

--
-- Name: Customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Customer" (
    id text NOT NULL,
    "storeName" text NOT NULL,
    "ownerName" text,
    phone text,
    address text,
    notes text,
    "preferredBalePriceId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Customer" OWNER TO postgres;

--
-- Name: Expense; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Expense" (
    id text NOT NULL,
    "categoryId" text NOT NULL,
    "expenseDate" timestamp(3) without time zone NOT NULL,
    amount numeric(14,2) NOT NULL,
    description text NOT NULL,
    "createdById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Expense" OWNER TO postgres;

--
-- Name: ExpenseCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ExpenseCategory" (
    id text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ExpenseCategory" OWNER TO postgres;

--
-- Name: InventoryMovement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InventoryMovement" (
    id text NOT NULL,
    "productId" text NOT NULL,
    "occurredAt" timestamp(3) without time zone NOT NULL,
    "movementType" public."InventoryMovementType" NOT NULL,
    "quantityKg" numeric(12,2) NOT NULL,
    "inboundTotalCost" numeric(14,2),
    notes text,
    "purchaseId" text,
    "saleId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."InventoryMovement" OWNER TO postgres;

--
-- Name: Konveksi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Konveksi" (
    id text NOT NULL,
    name text NOT NULL,
    "picName" text,
    phone text,
    address text,
    notes text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Konveksi" OWNER TO postgres;

--
-- Name: LandingSetting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LandingSetting" (
    id text NOT NULL,
    section text NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LandingSetting" OWNER TO postgres;

--
-- Name: Product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Product" (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    "currentStockKg" numeric(12,2) DEFAULT 0 NOT NULL,
    "averageCostPerKg" numeric(14,2) DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Product" OWNER TO postgres;

--
-- Name: Purchase; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Purchase" (
    id text NOT NULL,
    "supplierId" text NOT NULL,
    "productId" text NOT NULL,
    "purchaseDate" timestamp(3) without time zone NOT NULL,
    "quantityKg" numeric(12,2) NOT NULL,
    "pricePerKg" numeric(14,2) NOT NULL,
    subtotal numeric(14,2) NOT NULL,
    "transportExpense" numeric(14,2) DEFAULT 0 NOT NULL,
    "totalExpense" numeric(14,2) NOT NULL,
    notes text,
    "createdById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Purchase" OWNER TO postgres;

--
-- Name: Sale; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Sale" (
    id text NOT NULL,
    "customerId" text NOT NULL,
    "productId" text NOT NULL,
    "saleDate" timestamp(3) without time zone NOT NULL,
    "quantityKg" numeric(12,2) NOT NULL,
    "sellingPricePerKg" numeric(14,2) NOT NULL,
    subtotal numeric(14,2) NOT NULL,
    "deliveryExpense" numeric(14,2) DEFAULT 0 NOT NULL,
    "additionalExpense" numeric(14,2) DEFAULT 0 NOT NULL,
    "totalTransactionValue" numeric(14,2) NOT NULL,
    "paymentStatus" public."PaymentStatus" DEFAULT 'UNPAID'::public."PaymentStatus" NOT NULL,
    "amountPaid" numeric(14,2) DEFAULT 0 NOT NULL,
    "outstandingAmount" numeric(14,2) NOT NULL,
    "costBasisPerKgSnapshot" numeric(14,2) DEFAULT 0 NOT NULL,
    "estimatedCogs" numeric(14,2) DEFAULT 0 NOT NULL,
    "estimatedProfit" numeric(14,2) DEFAULT 0 NOT NULL,
    notes text,
    "createdById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Sale" OWNER TO postgres;

--
-- Name: SalePayment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SalePayment" (
    id text NOT NULL,
    "saleId" text NOT NULL,
    "paymentDate" timestamp(3) without time zone NOT NULL,
    amount numeric(14,2) NOT NULL,
    notes text,
    "createdById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SalePayment" OWNER TO postgres;

--
-- Name: Supplier; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Supplier" (
    id text NOT NULL,
    name text NOT NULL,
    phone text,
    address text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Supplier" OWNER TO postgres;

--
-- Name: Testimonial; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Testimonial" (
    id text NOT NULL,
    name text NOT NULL,
    company text NOT NULL,
    role text,
    content text NOT NULL,
    rating integer DEFAULT 5 NOT NULL,
    avatar text,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Testimonial" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text,
    email text NOT NULL,
    password text NOT NULL,
    role public."Role" DEFAULT 'ADMIN'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Data for Name: Article; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Article" (id, title, slug, excerpt, content, category, thumbnail, "isPublished", "publishedAt", "createdAt", "updatedAt") FROM stdin;
cmractpbg0001wcww6589kiwf	testtt	testtt	twsttt	<b>teststtststst</b><div><b><br></b></div><div>tess</div>	Blog	/uploads/1783410919371-387287349.jpg	f	\N	2026-07-07 07:55:36.165	2026-07-07 10:05:43.308
\.


--
-- Data for Name: BalePrice; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BalePrice" (id, "clothType", grade, "pricePerBal", notes, "createdAt", "updatedAt") FROM stdin;
cmpaeuf8h000986s9861pu0nv	PUTIH	A1	950000.00	Grade premium	2026-05-17 23:32:44.321	2026-07-07 15:56:32.71
cmpaeuf97000a86s9gdcynk3l	PUTIH	B2	900000.00	Grade menengah	2026-05-17 23:32:44.347	2026-07-07 15:56:32.733
cmpaeuf9c000b86s9jp71v4w6	PUTIH	C3	840000.00	Grade ekonomis	2026-05-17 23:32:44.352	2026-07-07 15:56:32.743
cmpaeuf9h000c86s91lzu4yws	WARNA	A1	980000.00	Grade premium	2026-05-17 23:32:44.357	2026-07-07 15:56:32.761
cmpaeuf9k000d86s9koezr6yo	WARNA	B2	930000.00	Grade menengah	2026-05-17 23:32:44.361	2026-07-07 15:56:32.777
cmpaeuf9o000e86s91klxerlk	WARNA	C3	870000.00	Grade ekonomis	2026-05-17 23:32:44.365	2026-07-07 15:56:32.785
\.


--
-- Data for Name: Bongkaran; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Bongkaran" (id, "konveksiId", "purchaseDate", "quantityKg", "pricePerKg", subtotal, "transportExpense", "additionalExpense", "totalCost", "costPerKgEffective", "sortedQuantityKg", status, notes, "createdById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: BongkaranSort; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BongkaranSort" (id, "bongkaranId", "sortDate", "inputKg", "outputPutihKg", "outputWarnaKg", "wasteKg", "laborExpense", "totalCost", "unitCostPutih", "unitCostWarna", notes, "createdById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CareerApplication; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CareerApplication" (id, "postId", "fullName", email, phone, "coverLetter", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CareerPost; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CareerPost" (id, title, department, location, type, description, requirements, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Customer" (id, "storeName", "ownerName", phone, address, notes, "preferredBalePriceId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Expense; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Expense" (id, "categoryId", "expenseDate", amount, description, "createdById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ExpenseCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ExpenseCategory" (id, name, "createdAt", "updatedAt") FROM stdin;
cmpaeuf62000386s9tcs59vcr	Delivery	2026-05-17 23:32:44.234	2026-05-17 23:32:44.234
cmpaeuf6i000486s9iq086eno	Fuel	2026-05-17 23:32:44.25	2026-05-17 23:32:44.25
cmpaeuf73000586s9ubldjfuk	Worker Salary	2026-05-17 23:32:44.272	2026-05-17 23:32:44.272
cmpaeuf7c000686s91ymou1ca	Packaging	2026-05-17 23:32:44.281	2026-05-17 23:32:44.281
cmpaeuf7l000786s9spvwejuf	Transportation	2026-05-17 23:32:44.289	2026-05-17 23:32:44.289
cmpaeuf88000886s9ao3gdmdx	Miscellaneous	2026-05-17 23:32:44.312	2026-05-17 23:32:44.312
\.


--
-- Data for Name: InventoryMovement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."InventoryMovement" (id, "productId", "occurredAt", "movementType", "quantityKg", "inboundTotalCost", notes, "purchaseId", "saleId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Konveksi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Konveksi" (id, name, "picName", phone, address, notes, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LandingSetting; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LandingSetting" (id, section, key, value, "createdAt", "updatedAt") FROM stdin;
cmpaeufau000j86s99wqkhed0	stats	years	10+	2026-05-17 23:32:44.406	2026-05-17 23:32:44.406
cmpaeufb2000l86s9y089v4og	stats	products	50+	2026-05-17 23:32:44.414	2026-05-17 23:32:44.414
cmpaeufb5000m86s9b6lvu98c	stats	rating	4.9	2026-05-17 23:32:44.418	2026-05-17 23:32:44.418
cmpaeufbz000r86s9l0e2qwmq	order	title	Cara Pemesanan	2026-05-17 23:32:44.448	2026-05-17 23:32:44.448
cmpaeufc5000s86s96hv3watd	order	step1	Hubungi kami via WhatsApp	2026-05-17 23:32:44.453	2026-05-17 23:32:44.453
cmpaeufc8000t86s91tsnt9a5	order	step2	Pilih jenis dan jumlah majun	2026-05-17 23:32:44.457	2026-05-17 23:32:44.457
cmpaeufcc000u86s9vxvpxfkc	order	step3	Konfirmasi harga dan ongkir	2026-05-17 23:32:44.46	2026-05-17 23:32:44.46
cmpaeufcg000v86s9nzk2kabb	order	step4	Proses pengiriman	2026-05-17 23:32:44.464	2026-05-17 23:32:44.464
cmpaeufd6000y86s9g6i34lxp	cta	buttonText	Chat WhatsApp	2026-05-17 23:32:44.491	2026-05-17 23:32:44.491
cmpaeufda000z86s99vv2gs8o	cta	buttonLink	https://wa.me/6281234567890	2026-05-17 23:32:44.494	2026-05-17 23:32:44.494
cmpaeufdh001186s910z7fbil	footer	phone	0812-3456-7890	2026-05-17 23:32:44.502	2026-05-17 23:32:44.502
cmpaeufdn001386s9z7fv8tgs	footer	whatsapp	0812-3456-7890	2026-05-17 23:32:44.508	2026-05-17 23:32:44.508
cmpaeufdr001486s9p82iekf4	maps	embedUrl	https://maps.google.com/?q=-6.241678,106.741917	2026-05-17 23:32:44.511	2026-05-17 23:32:44.511
cmpaeufdu001586s9vloa46li	maps	latitude	-6.241678	2026-05-17 23:32:44.515	2026-05-17 23:32:44.515
cmpaeufeb001686s9zcn2d1pt	maps	longitude	106.741917	2026-05-17 23:32:44.531	2026-05-17 23:32:44.531
cmpaeufef001786s961mkrvle	maps	placeName	Kreo Selatan, Kota Tangerang	2026-05-17 23:32:44.535	2026-05-17 23:32:44.535
cmpaexozk000uztdiurxsxb50	about	hours	08.00 — 17.00 WIB	2026-05-17 23:35:16.928	2026-07-07 15:56:32.877
cmpaeufcn000x86s9v5yfxk5b	cta	subtitle	Hubungi kami sekarang via WhatsApp untuk konsultasi dan penawaran harga terbaik.	2026-05-17 23:32:44.472	2026-07-07 15:56:32.958
cmpaeufbg000p86s9sopf61xh	about	vision	Menjadi supplier majun terpercaya dengan kualitas terbaik dan harga terjangkau	2026-05-17 23:32:44.428	2026-07-07 06:33:58.674
cmpaeufdk001286s9qhtu6v7b	footer	email	sidarmamajun@gmail.com	2026-05-17 23:32:44.505	2026-07-07 15:56:32.985
cmpaeufdd001086s96ppau7zw	footer	address	Jl. Industri Maju No. 18, Bandung	2026-05-17 23:32:44.498	2026-07-07 15:56:32.989
cmpaexozn000vztdidfs0fzbg	about	phone	0812-3456-7890	2026-05-17 23:35:16.932	2026-07-07 15:56:32.882
cmpaexozr000wztdi8v482tz6	about	stock	± 10 Ton	2026-05-17 23:35:16.935	2026-07-07 15:56:32.887
cmpaexp1o0014ztdib4xs24jd	order	step1_desc	Chat via WhatsApp atau telepon untuk konsultasi kebutuhan.	2026-05-17 23:35:17.004	2026-07-07 15:56:32.929
cmpaeufbj000q86s9waewlr45	about	mission	Menyediakan produk berkualitas, pengiriman cepat, dan layanan pelanggan yang memuaskan	2026-05-17 23:32:44.432	2026-07-07 06:33:58.66
cmpaexp1r0015ztdizl9rxr05	order	step2_title	Konfirmasi Order	2026-05-17 23:35:17.007	2026-07-07 15:56:32.933
cmpaexp1u0016ztdizmuqormh	order	step2_desc	Pilih produk, tentukan quantity, dan sepakati harga.	2026-05-17 23:35:17.011	2026-07-07 15:56:32.94
cmpaexp1x0017ztdi9l7z9liq	order	step3_title	Proses & Kirim	2026-05-17 23:35:17.014	2026-07-07 15:56:32.944
cmpaexp210018ztdib2xzf6tn	order	step3_desc	Barang disiapkan & dikirim lewat ekspedisi terpercaya.	2026-05-17 23:35:17.017	2026-07-07 15:56:32.949
cmpaexp2a001bztdiztkkih2d	footer	company_name	CV. SIDARMA MAJUN	2026-05-17 23:35:17.027	2026-07-07 15:56:32.963
cmpaexp2e001cztdiw6ecmm6k	footer	description	Penyedia kain majun putih dan warna berkualitas untuk kebutuhan industri, bengkel, rumah sakit, dan cleaning service.	2026-05-17 23:35:17.03	2026-07-07 15:56:32.967
cmpaexp2h001dztdinl5odxlo	footer	wa_label	WhatsApp	2026-05-17 23:35:17.033	2026-07-07 15:56:32.972
cmpaexp2k001eztdie0k327xn	footer	wa_number	0812-3456-7890	2026-05-17 23:35:17.037	2026-07-07 15:56:32.976
cmpaeufaq000i86s9wmwwp05u	hero	ctaLink	#order	2026-05-17 23:32:44.403	2026-07-07 06:42:05.166
cmpaeufck000w86s9ib19rz1o	cta	title	Siap memesan kain majun?	2026-05-17 23:32:44.468	2026-07-07 15:56:32.954
cmpaexoz1000pztdijg1r48vv	stats	response	24 Jam	2026-05-17 23:35:16.91	2026-07-07 15:56:32.851
cmpaexoz5000qztdis1a6sl75	about	badge	Kenapa Memilih Kami	2026-05-17 23:35:16.913	2026-07-07 15:56:32.856
cmpaeufb9000n86s9w6229ppf	about	title	Distributor langsung, harga lebih hemat	2026-05-17 23:32:44.421	2026-07-07 15:56:32.86
cmpaeufbc000o86s9107tnvaw	about	description	CV. SIDARMA MAJUN hadir sebagai solusi pasokan kain majun berkualitas dengan harga langsung dari sumber. Dengan pengalaman lebih dari 5 tahun, kami melayani ratusan toko dan pabrik di Pulau Jawa.	2026-05-17 23:32:44.425	2026-07-07 15:56:32.865
cmpaexozu000xztdislkydvbb	about	trust1	Bahan berkualitas, tidak mudah robek	2026-05-17 23:35:16.939	2026-07-07 15:56:32.892
cmpaexozy000yztdib7lao6do	about	trust2	Daya serap tinggi & cepat kering	2026-05-17 23:35:16.942	2026-07-07 15:56:32.9
cmpaexp2n001fztdipw6ffudt	footer	email_label	Email	2026-05-17 23:35:17.04	2026-07-07 15:56:32.98
cmpaexp2z001iztdiz3z831fi	footer	hours_weekday	Senin — Jumat: 08.00 — 17.00	2026-05-17 23:35:17.051	2026-07-07 15:56:32.994
cmpaexp32001jztdibw99319e	footer	hours_saturday	Sabtu: 08.00 — 14.00	2026-05-17 23:35:17.054	2026-07-07 15:56:32.999
cmpaexp36001kztdiftkbtr1q	footer	hours_sunday	Minggu: Tutup	2026-05-17 23:35:17.058	2026-07-07 15:56:33.003
cmpaexp39001lztdi4zfxk4yo	maps	embed_url	https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5!2d106.7419172!3d-6.2416776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTQnMjAuMCJTIDEwNsKwNDQnMzAuOSJF!5e0!3m2!1sid!2sid	2026-05-17 23:35:17.062	2026-07-07 15:56:33.008
cmpaexoxy000hztdibiyfc6go	hero	subtitle	untuk Semua Kebutuhan	2026-05-17 23:35:16.87	2026-07-07 15:56:32.81
cmpaexoyo000mztdict5afj71	stats	exp_years	5+	2026-05-17 23:35:16.896	2026-07-07 15:56:32.836
cmpaeufay000k86s9qpdyrrrr	stats	customers	100+	2026-05-17 23:32:44.41	2026-07-07 15:56:32.841
cmpaexoyw000oztdistw7cq1k	stats	stock	10 Ton	2026-05-17 23:35:16.905	2026-07-07 15:56:32.846
cmpaexozf000tztdi9j8oxix5	about	address	Jl. Industri Maju No. 18, Bandung	2026-05-17 23:35:16.924	2026-07-07 15:56:32.87
cmpaexp1c0011ztdiqhgn7v0g	about	trust5	Minimal order 20 kg	2026-05-17 23:35:16.993	2026-07-07 15:56:32.915
cmpaexp1k0013ztdillcmrglv	order	step1_title	Hubungi Kami	2026-05-17 23:35:17	2026-07-07 15:56:32.924
cmra9k0qs000bor1j54jqvsmc	products	list	[{"name":"Majun Lembaran (Tanpa Jahit)","category":"Kain Majun","desc":"Kain potongan utuh tanpa sambungan. Daya serap tinggi, tidak meninggalkan serat. Ideal untuk mesin presisi & permukaan kaca.","image":"/uploads/1783405403613-56458178.png","uses":["Mesin presisi & optik","Lab & farmasi","Elektronik & semikonduktor","Kaca & cermin"]},{"name":"Majun Jahit Sambung","category":"Kain Majun","desc":"Potongan perca dijahit menyambung memanjang. Ekonomis, berdaya serap optimal. Pilihan hemat untuk kebutuhan volume tinggi.","image":"https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80","uses":["Pabrik & gudang","Bengkel otomotif","Cleaning service","Pertanian & perikanan"]},{"name":"Majun Jahit Tumpuk","category":"Kain Majun","desc":"Beberapa lapis kain perca dijahit bertumpuk. Tebal, kuat, dan sangat efektif untuk membersihkan oli dan kotoran berat.","image":"https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80","uses":["Bengkel berat & kapal","Industri minyak & gas","Pabrik baja & logam","Konstruksi"]},{"name":"Sarung Tangan Industri","category":"Alat Pelindung","desc":"Sarung tangan benang katun untuk perlindungan tangan pekerja. Nyaman dipakai seharian, daya cengkeram optimal.","image":"https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80","uses":["Pabrik manufaktur","Gudang & logistik","Konstruksi","Pertanian"]},{"name":"Alat Pelindung Diri (APD)","category":"Alat Pelindung","desc":"Masker, kacamata safety, dan perlengkapan APD standar industri sebagai pelengkap keamanan kerja.","image":"https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=600&q=80","uses":["Semua sektor industri","Rumah sakit & klinik","Laboratorium","Pabrik kimia"]}]	2026-07-07 06:24:05.316	2026-07-07 06:24:05.316
cmpaexp180010ztdi6p4eo707	about	trust4	Pengiriman cepat ke seluruh Jawa	2026-05-17 23:35:16.989	2026-07-07 15:56:32.911
cmpaexp1g0012ztdisxmys1fv	about	trust6	Bisa cicilan untuk customer tetap	2026-05-17 23:35:16.996	2026-07-07 15:56:32.92
cmpaexp3c001mztdim1i1lgi8	maps	maps_link	https://maps.app.goo.gl/aJDEdUZwJ8M3wnEP9?g_st=ic	2026-05-17 23:35:17.065	2026-07-07 15:56:33.012
cmpaexp3i001nztdifsmg2za6	maps	location_name	Lokasi Gudang Kami	2026-05-17 23:35:17.071	2026-07-07 15:56:33.017
cmpaexp3m001oztdi9as5lacm	maps	location_subtitle	Area pergudangan & industri	2026-05-17 23:35:17.074	2026-07-07 15:56:33.021
cmpaeufam000h86s9vd8vq3qe	hero	ctaText	Pesan Sekarang	2026-05-17 23:32:44.399	2026-07-07 06:42:05.166
cmra9vdnk000b4pl9ijg8pt8n	hero	image	/uploads/1783405972307-643050470.jpg	2026-07-07 06:32:55.242	2026-07-07 06:42:05.166
cmpaeufaa000f86s9n8zjumxp	hero	tagline	Kain Majun Berkualitas untuk Kebutuhan Industri & Rumah Tangga	2026-05-17 23:32:44.387	2026-07-07 06:42:05.171
cmpaeufai000g86s9cdpdh3rf	hero	subtagline	Menyediakan berbagai jenis majun dari sisa tenun dengan harga terjangkau	2026-05-17 23:32:44.395	2026-07-07 06:42:05.167
cmraaq6410000wcwwaou5ifvb	testimonials	list	[{"name":"Bapak Hendra","company":"CV. Maju Jaya Bengkel","role":"Owner","content":"Sudah 3 tahun langganan SIDARMA. Kualitas majun putihnya konsisten, tidak pernah mengecewakan. Stok selalu tersedia dan pengiriman cepat.","rating":5,"avatar":""},{"name":"Ibu Sari","company":"PT. Bersih Semesta","role":"Purchasing Manager","content":"Sebagai cleaning service yang butuh stok rutin, SIDARMA jadi mitra terpercaya kami. Harga distributor jauh lebih kompetitif dari pasar.","rating":5,"avatar":""},{"name":"Pak Doni","company":"Galangan Kapal Nusantara","role":"Site Manager","content":"Majun jahit tumpuknya sangat kuat dan tahan lama. Kami pakai untuk pembersihan mesin kapal yang penuh oli berat, hasilnya memuaskan.","rating":5,"avatar":""},{"name":"tole","company":"pencari cinta sejati","role":"ceo","content":"test","rating":5,"avatar":"/uploads/1783407410940-511965630.jpg"}]	2026-07-07 06:56:52.067	2026-07-07 06:56:52.067
cmraduqh80002wcww6aoiijbm	catalog_banner	bg_image	/uploads/1783412660824-767496362.jpg	2026-07-07 08:24:23.815	2026-07-07 08:24:23.815
cmpaexoxm000fztdim9zqsk79	hero	badge	Supplier kain majun terpercaya sejak 2019	2026-05-17 23:35:16.858	2026-07-07 15:56:32.794
cmpaexoxt000gztdi2vva8c2t	hero	title	Kain Majun Berkualitas	2026-05-17 23:35:16.866	2026-07-07 15:56:32.804
cmpaexoy3000iztdiz8yezb0h	hero	description	Majun putih & warna siap kirim dalam quantity besar. Harga distributor, kualitas premium, pengiriman cepat ke seluruh Jawa.	2026-05-17 23:35:16.875	2026-07-07 15:56:32.815
cmpaexoy8000jztdi8cqn7qyj	hero	trust1	Bebas ongkir Jabodetabek	2026-05-17 23:35:16.881	2026-07-07 15:56:32.821
cmpaexoye000kztdir2rfgfdi	hero	trust2	Stock siap kirim	2026-05-17 23:35:16.886	2026-07-07 15:56:32.826
cmpaexoyj000lztdisu8e3g2l	hero	wa_number	6281234567890	2026-05-17 23:35:16.891	2026-07-07 15:56:32.831
cmpaexp15000zztdiof1usip1	about	trust3	Harga langsung dari distributor	2026-05-17 23:35:16.985	2026-07-07 15:56:32.906
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Product" (id, code, name, "currentStockKg", "averageCostPerKg", "isActive", "createdAt", "updatedAt") FROM stdin;
cmpaeuf52000186s9iqq3if1q	MAJUN_PUTIH	Majun Putih	0.00	0.00	t	2026-05-17 23:32:44.198	2026-07-07 15:56:32.606
cmpaeuf5y000286s992dk9a64	MAJUN_WARNA	Majun Warna	0.00	0.00	t	2026-05-17 23:32:44.23	2026-07-07 15:56:32.625
\.


--
-- Data for Name: Purchase; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Purchase" (id, "supplierId", "productId", "purchaseDate", "quantityKg", "pricePerKg", subtotal, "transportExpense", "totalExpense", notes, "createdById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Sale; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Sale" (id, "customerId", "productId", "saleDate", "quantityKg", "sellingPricePerKg", subtotal, "deliveryExpense", "additionalExpense", "totalTransactionValue", "paymentStatus", "amountPaid", "outstandingAmount", "costBasisPerKgSnapshot", "estimatedCogs", "estimatedProfit", notes, "createdById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SalePayment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SalePayment" (id, "saleId", "paymentDate", amount, notes, "createdById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Supplier; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Supplier" (id, name, phone, address, notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Testimonial; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Testimonial" (id, name, company, role, content, rating, avatar, "isFeatured", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, password, role, "createdAt", "updatedAt") FROM stdin;
cmpaeuf44000086s9xfb0ll2r	Admin Majun	admin@majun.local	$2b$10$EWXuWcp6RfZzGRVMxRNQre3jZPNi6wZCWVbQOxwwFd2frk3ZBWkQW	ADMIN	2026-05-17 23:32:44.164	2026-05-17 23:32:44.164
cmpaf4bph0002l8i3x18hfej3	Test User	newuser@test.com	$2b$10$7ifeWh8NzRrKxqmuSjY0YO2k5WNikYd6g9/Ev1DoWPFU9P0typnBK	ADMIN	2026-05-17 23:40:26.309	2026-05-17 23:40:26.309
\.


--
-- Name: Article Article_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_pkey" PRIMARY KEY (id);


--
-- Name: BalePrice BalePrice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BalePrice"
    ADD CONSTRAINT "BalePrice_pkey" PRIMARY KEY (id);


--
-- Name: BongkaranSort BongkaranSort_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BongkaranSort"
    ADD CONSTRAINT "BongkaranSort_pkey" PRIMARY KEY (id);


--
-- Name: Bongkaran Bongkaran_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bongkaran"
    ADD CONSTRAINT "Bongkaran_pkey" PRIMARY KEY (id);


--
-- Name: CareerApplication CareerApplication_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CareerApplication"
    ADD CONSTRAINT "CareerApplication_pkey" PRIMARY KEY (id);


--
-- Name: CareerPost CareerPost_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CareerPost"
    ADD CONSTRAINT "CareerPost_pkey" PRIMARY KEY (id);


--
-- Name: Customer Customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_pkey" PRIMARY KEY (id);


--
-- Name: ExpenseCategory ExpenseCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExpenseCategory"
    ADD CONSTRAINT "ExpenseCategory_pkey" PRIMARY KEY (id);


--
-- Name: Expense Expense_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_pkey" PRIMARY KEY (id);


--
-- Name: InventoryMovement InventoryMovement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryMovement"
    ADD CONSTRAINT "InventoryMovement_pkey" PRIMARY KEY (id);


--
-- Name: Konveksi Konveksi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Konveksi"
    ADD CONSTRAINT "Konveksi_pkey" PRIMARY KEY (id);


--
-- Name: LandingSetting LandingSetting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LandingSetting"
    ADD CONSTRAINT "LandingSetting_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: Purchase Purchase_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_pkey" PRIMARY KEY (id);


--
-- Name: SalePayment SalePayment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SalePayment"
    ADD CONSTRAINT "SalePayment_pkey" PRIMARY KEY (id);


--
-- Name: Sale Sale_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sale"
    ADD CONSTRAINT "Sale_pkey" PRIMARY KEY (id);


--
-- Name: Supplier Supplier_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Supplier"
    ADD CONSTRAINT "Supplier_pkey" PRIMARY KEY (id);


--
-- Name: Testimonial Testimonial_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Testimonial"
    ADD CONSTRAINT "Testimonial_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Article_isPublished_publishedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Article_isPublished_publishedAt_idx" ON public."Article" USING btree ("isPublished", "publishedAt");


--
-- Name: Article_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Article_slug_idx" ON public."Article" USING btree (slug);


--
-- Name: Article_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Article_slug_key" ON public."Article" USING btree (slug);


--
-- Name: BalePrice_clothType_grade_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "BalePrice_clothType_grade_key" ON public."BalePrice" USING btree ("clothType", grade);


--
-- Name: BalePrice_clothType_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BalePrice_clothType_idx" ON public."BalePrice" USING btree ("clothType");


--
-- Name: BongkaranSort_bongkaranId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BongkaranSort_bongkaranId_idx" ON public."BongkaranSort" USING btree ("bongkaranId");


--
-- Name: BongkaranSort_sortDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BongkaranSort_sortDate_idx" ON public."BongkaranSort" USING btree ("sortDate");


--
-- Name: Bongkaran_konveksiId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Bongkaran_konveksiId_idx" ON public."Bongkaran" USING btree ("konveksiId");


--
-- Name: Bongkaran_purchaseDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Bongkaran_purchaseDate_idx" ON public."Bongkaran" USING btree ("purchaseDate");


--
-- Name: Bongkaran_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Bongkaran_status_idx" ON public."Bongkaran" USING btree (status);


--
-- Name: CareerApplication_postId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CareerApplication_postId_idx" ON public."CareerApplication" USING btree ("postId");


--
-- Name: CareerPost_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CareerPost_isActive_idx" ON public."CareerPost" USING btree ("isActive");


--
-- Name: Customer_preferredBalePriceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Customer_preferredBalePriceId_idx" ON public."Customer" USING btree ("preferredBalePriceId");


--
-- Name: Customer_storeName_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Customer_storeName_key" ON public."Customer" USING btree ("storeName");


--
-- Name: ExpenseCategory_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ExpenseCategory_name_key" ON public."ExpenseCategory" USING btree (name);


--
-- Name: Expense_categoryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Expense_categoryId_idx" ON public."Expense" USING btree ("categoryId");


--
-- Name: Expense_expenseDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Expense_expenseDate_idx" ON public."Expense" USING btree ("expenseDate");


--
-- Name: InventoryMovement_productId_occurredAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "InventoryMovement_productId_occurredAt_idx" ON public."InventoryMovement" USING btree ("productId", "occurredAt");


--
-- Name: InventoryMovement_purchaseId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "InventoryMovement_purchaseId_key" ON public."InventoryMovement" USING btree ("purchaseId");


--
-- Name: InventoryMovement_saleId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "InventoryMovement_saleId_key" ON public."InventoryMovement" USING btree ("saleId");


--
-- Name: Konveksi_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Konveksi_name_key" ON public."Konveksi" USING btree (name);


--
-- Name: LandingSetting_section_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "LandingSetting_section_idx" ON public."LandingSetting" USING btree (section);


--
-- Name: LandingSetting_section_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "LandingSetting_section_key_key" ON public."LandingSetting" USING btree (section, key);


--
-- Name: Product_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Product_code_key" ON public."Product" USING btree (code);


--
-- Name: Product_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Product_name_key" ON public."Product" USING btree (name);


--
-- Name: Purchase_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Purchase_productId_idx" ON public."Purchase" USING btree ("productId");


--
-- Name: Purchase_purchaseDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Purchase_purchaseDate_idx" ON public."Purchase" USING btree ("purchaseDate");


--
-- Name: Purchase_supplierId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Purchase_supplierId_idx" ON public."Purchase" USING btree ("supplierId");


--
-- Name: SalePayment_paymentDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SalePayment_paymentDate_idx" ON public."SalePayment" USING btree ("paymentDate");


--
-- Name: SalePayment_saleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SalePayment_saleId_idx" ON public."SalePayment" USING btree ("saleId");


--
-- Name: Sale_customerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Sale_customerId_idx" ON public."Sale" USING btree ("customerId");


--
-- Name: Sale_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Sale_productId_idx" ON public."Sale" USING btree ("productId");


--
-- Name: Sale_saleDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Sale_saleDate_idx" ON public."Sale" USING btree ("saleDate");


--
-- Name: Supplier_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Supplier_name_key" ON public."Supplier" USING btree (name);


--
-- Name: Testimonial_isFeatured_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Testimonial_isFeatured_idx" ON public."Testimonial" USING btree ("isFeatured");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: BongkaranSort BongkaranSort_bongkaranId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BongkaranSort"
    ADD CONSTRAINT "BongkaranSort_bongkaranId_fkey" FOREIGN KEY ("bongkaranId") REFERENCES public."Bongkaran"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BongkaranSort BongkaranSort_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BongkaranSort"
    ADD CONSTRAINT "BongkaranSort_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Bongkaran Bongkaran_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bongkaran"
    ADD CONSTRAINT "Bongkaran_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Bongkaran Bongkaran_konveksiId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bongkaran"
    ADD CONSTRAINT "Bongkaran_konveksiId_fkey" FOREIGN KEY ("konveksiId") REFERENCES public."Konveksi"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CareerApplication CareerApplication_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CareerApplication"
    ADD CONSTRAINT "CareerApplication_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."CareerPost"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Customer Customer_preferredBalePriceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_preferredBalePriceId_fkey" FOREIGN KEY ("preferredBalePriceId") REFERENCES public."BalePrice"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Expense Expense_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."ExpenseCategory"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Expense Expense_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: InventoryMovement InventoryMovement_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryMovement"
    ADD CONSTRAINT "InventoryMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: InventoryMovement InventoryMovement_purchaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryMovement"
    ADD CONSTRAINT "InventoryMovement_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES public."Purchase"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InventoryMovement InventoryMovement_saleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryMovement"
    ADD CONSTRAINT "InventoryMovement_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES public."Sale"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Purchase Purchase_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Purchase Purchase_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Purchase Purchase_supplierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES public."Supplier"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SalePayment SalePayment_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SalePayment"
    ADD CONSTRAINT "SalePayment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SalePayment SalePayment_saleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SalePayment"
    ADD CONSTRAINT "SalePayment_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES public."Sale"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Sale Sale_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sale"
    ADD CONSTRAINT "Sale_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Sale Sale_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sale"
    ADD CONSTRAINT "Sale_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Sale Sale_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sale"
    ADD CONSTRAINT "Sale_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict gWiBtyQBhAVI4o6nOLGZYlelWQc2B2v9WsAaIOUYl25dC4x1fe1oTbAWWvnmVTx

