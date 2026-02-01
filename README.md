Link - https://kodekalesh-2025-nozh.vercel.app/login
JuriSight

> **Intelligent Judicial Orchestration:** A dual-portal ecosystem designed to streamline legal workflows using AI-driven case prioritization, automated workload balancing, and distributed document processing.

<div align="center">
  <img src="https://capsule-render.vercel.app/render?type=soft&color=auto&height=250&section=header&text=JuriSight&fontSize=90&animation=fadeIn&fontAlignY=38" width="100%" />
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Logic-AI_Case_Prioritization-6E40C9?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Workflows-Durable_Inngest-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Security-AWS_S3_Vault-blue?style=for-the-badge" />
</p>

<p align="center">
  <a href="#-the-ecosystem">Ecosystem</a> •
  <a href="#-technical-architecture">Architecture</a> •
  <a href="#-distributed-workflows">Workflows</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-future-roadmap">Roadmap</a>
</p>

---

## 🏛️ The Ecosystem

JuriSight provides a specialized experience based on the user's role in the legal system:

### 👨‍⚖️ The Judge's Bench
* **AI Prioritization:** Cases are automatically ranked based on legal importance and urgency.
* **Case Recommendations:** Intelligent suggestions for related cases or relevant precedents.
* **Workload Overview:** A streamlined view of the current docket to manage judicial bandwidth.

### ⚖️ The Lawyer's Portal
* **Secure Ingestion:** Upload legal documents directly to an encrypted **AWS S3** bucket.
* **Automated Assignment:** Once a case is created, the system triggers a background worker to find the perfect judge.
* **Case Tracking:** Real-time updates on case status and judicial assignment.

---

## 🏗️ Technical Architecture

JuriSight utilizes a **Distributed Event-Driven Architecture** to handle heavy document processing and complex AI reasoning.

### 🧩 The Intelligent Assignment Engine
1.  **Ingestion:** A lawyer uploads a `.pdf` or `.docx`.
2.  **Storage:** The file is persisted in **AWS S3**, generating a unique object key.
3.  **Durable Workflow:** **Inngest** triggers a background job that analyzes:
    * **Judge Record:** Expertise in specific legal domains.
    * **Availability:** Current calendar status.
    * **Workload Pressure:** Active case count to prevent burnout.
4.  **Final Routing:** The case is dynamically assigned, and the Judge's dashboard is updated in real-time.

---

## 🛠️ Tech Stack

| Layer | Technology | Usage |
| :--- | :--- | :--- |
| **Framework** | ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white) | Core application framework for role-based Judge/Lawyer portals and server-side rendering. |
| **Workflow Engine** | ![Inngest](https://img.shields.io/badge/Inngest-000000?style=flat&logo=inngest&logoColor=white) | **Durable Orchestration:** Managing background case assignments, document analysis, and system event triggers. |
| **Object Storage** | ![AWS S3](https://img.shields.io/badge/AWS_S3-569A31?style=flat&logo=amazons3&logoColor=white) | **Legal Vault:** Secure, scalable storage for sensitive legal documents and evidentiary filings. |
| **Database** | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) | **Data Layer:** Storing case metadata, judicial records, and real-time workload statistics. |
| **Intelligence** | ![Gemini](https://img.shields.io/badge/Google_Gemini-8E75C2?style=flat&logo=google&logoColor=white) | **Judicial Brain:** Powering the case recommendation engine and prioritization logic for the Judge's bench. |
| **Future Tech** | ![Blockchain](https://img.shields.io/badge/Transparency-Blockchain_Ready-purple?style=flat) | Planned integration for document notarization and anti-tamper verification. |

## ⚙️ System Flow

```mermaid
graph TD
    %% Roles
    L[⚖️ Lawyer] -->|Upload Doc| S3[(AWS S3)]
    S3 -->|Trigger| ING[Inngest Workflow]
    
    subgraph "The Judicial Brain"
        ING -->|Analyze Data| LLM[AI Agent / Gemini]
        LLM -->|Query Load| MDB[(MongoDB)]
        MDB -->|Judge Stats| LLM
        LLM -->|Optimal Match| ASSIGN[Smart Assignment]
    end

    ASSIGN -->|Update Docket| J[👨‍⚖️ Judge Dashboard]
    
    subgraph "Judge Interaction"
        J -->|Sort| PRIO[AI Prioritization]
        J -->|View| REC[Case Recommendations]
    end

    style ING fill:#6E40C9,color:#fff
    style LLM fill:#f96,stroke:#333,stroke-width:2px
    style S3 fill:#569A31,color:#fff
