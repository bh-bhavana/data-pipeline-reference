import AWS from "aws-sdk";
import axios from "axios";
//import { addItemToDDB } from "../ddb.mjs";
//import updateBullhorn from "./updateBullhorn.mjs";

AWS.config.update({ region: "us-west-2" });

export async function getData(BhRestToken, fields) {
  const restUrl = "https://rest42.bullhornstaffing.com/rest-services/6rmuc9/";

  //const fieldsParams = fields;
  //console.log(`fields check`, fieldsParams);

  const fieldsParams =
    "id,activePlacements,address,addressSourceLocation,branch,businessSectors,canEnterTime,candidateSource,categories,category,certificationList,certifications,clientCorporationBlackList,clientCorporationWhiteList,clientRating,comments,companyName,companyURL,customDate1,customDate10,customDate11,customDate12,customDate13,customDate2,customDate3,customDate4,customDate5,customDate6,customDate7,customDate8,customDate9,customEncryptedText1,customEncryptedText10,customEncryptedText2,customEncryptedText3,customEncryptedText4,customEncryptedText5,customEncryptedText6,customEncryptedText7,customEncryptedText8,customEncryptedText9,customFloat1,customFloat10,customFloat11,customFloat12,customFloat13,customFloat14,customFloat15,customFloat16,customFloat17,customFloat18,customFloat19,customFloat2,customFloat20,customFloat21,customFloat22,customFloat23,customFloat3,customFloat4,customFloat5,customFloat6,customFloat7,customFloat8,customFloat9,customInt1,customInt10,customInt11,customInt12,customInt13,customInt14,customInt15,customInt16,customInt17,customInt18,customInt19,customInt2,customInt20,customInt21,customInt22,customInt23,customInt3,customInt4,customInt5,customInt6,customInt7,customInt8,customInt9,customObject3s,customText1,customText10,customText11,customText12,customText13,customText14,customText15,customText16,customText17,customText18,customText19,customText2,customText20,customText21,customText22,customText23,customText24,customText25,customText26,customText27,customText28,customText29,customText3,customText30,customText31,customText32,customText33,customText34,customText35,customText36,customText37,customText38,customText39,customText4,customText40,customText5,customText6,customText7,customText8,customText9,customTextBlock1,customTextBlock10,customTextBlock2,customTextBlock3,customTextBlock4,customTextBlock5,customTextBlock6,customTextBlock7,customTextBlock8,customTextBlock9,dateAdded,dateAvailable,dateAvailableEnd,dateI9Expiration,dateLastComment,dateLastModified,dateLastPayrollProviderSync,dateNextCall,dateOfBirth,dayRate,dayRateLow,degreeList,description,desiredLocations,disability,educationDegree,educations,email,email2,email3,employeeType,employmentPreference,estaffGUID,ethnicity,experience,externalID,fax,fax2,fax3,federalAddtionalWitholdingsAmount,federalExemptions,federalExtraWithholdingAmount,federalFilingStatus,fileAttachments,firstName,gender,hourlyRate,hourlyRateLow,i9OnFile,interviews,isAnonymized,isDayLightSavings,isDeleted,isEditable,isExempt,isLockedOut,lastName,leads,linkedPerson,localAddtionalWitholdingsAmount,localExemptions,localFilingStatus,localTaxCode,locations,maritalStatus,massMailOptOut,masterUserID,middleName,migrateGUID,mobile,name,namePrefix,nameSuffix,nickName,notes,numCategories,numOwners,occupation,onboardingDocumentReceivedCount,onboardingDocumentSentCount,onboardingPercentComplete,onboardingReceivedSent,onboardingStatus,otherDeductionsAmount,otherIncomeAmount,owner,pager,paperWorkOnFile,password,payrollClientStartDate,payrollStatus,personSubtype,phone,phone2,phone3,placements,preferredContact,primarySkills,recentClientList,references,referredBy,referredByPerson,salary,salaryLow,secondaryAddress,secondaryOwners,secondarySkills,sendouts,shifts,skillSet,source,specialties,ssn,stateAddtionalWitholdingsAmount,stateExemptions,stateFilingStatus,status,submissions,tasks,taxID,taxState,tearsheets,timeZoneOffsetEST,tobaccoUser,totalDependentClaimAmount,travelLimit,travelMethod,twoJobs,type,userDateAdded,userType,username,veteran,webResponses,willRelocate,workAuthorized,workHistories,workPhone";

  /*
  Details for this Event subscription:

  {
    "subscriptionId": "newCandidateSubscription",
    "jmsSelector": "JMSType='ENTITY' AND BhCorpId=20229 AND BhEntityName='Candidate' AND BhEntityEventType='INSERTED'",
    "lastRequestId": 0,
    "createdOn": 1681412903707
  }
  */

  try {
    //GET Candidate IDs from Candidate Subscription
    const response = await axios.get(
      //`${restUrl}event/subscription/newCandidateSubscription?BhRestToken=${BhRestToken}&maxEvents=500`
      `${restUrl}event/subscription/newCandidateSubscription?BhRestToken=${BhRestToken}&maxEvents=100&requestId=1` // I use line this for testing
    );
    const requestId = response.data.requestId;
    const resultArray = response.data.events;
    const newArray = resultArray.map((event) => event.entityId);
    const subIds = newArray.join(",");
    //console.log(`subIds`, subIds);

    try {
      const response2 = await axios.get(
        `${restUrl}entity/Candidate/${subIds}?BhRestToken=${BhRestToken}&fields=${fieldsParams}`
      );
      const candidates = response2.data.data;

      if (candidates.length > 0) {
        //console.log(`Candidates found, count=`, candidates.length);

        for (const candidate of candidates) {
          let candidateData = {
            requestId: requestId,
            ID: candidate.id,
            ActiveAssignments: candidate.activePlacements,
            Address: candidate.address,
            AddressSourceLocation: candidate.addressSourceLocation,
            BranchID: candidate.branch,
            Industry: candidate.businessSectors,
            CanEnterTime: candidate.canEnterTime,
            ThirdParty: candidate.candidateSource,
            Discipline: candidate.categories,
            Category: candidate.category,
            Credentials: candidate.certificationList,
            Certifications: candidate.certifications,
            Blacklist: candidate.clientCorporationBlackList,
            Whitelist: candidate.clientCorporationWhiteList,
            ClientSurveyRating: candidate.clientRating,
            GeneralCandidateComments: candidate.comments,
            CurrentFacility: candidate.companyName,
            LinkedIn: candidate.companyURL,
            RetentionNotesUpdated: candidate.customDate1,
            MTASigned: candidate.customDate10,
            BenefitsWaiverSigned: candidate.customDate11,
            Anniversary: candidate.customDate12,
            CustomDate13: candidate.customDate13,
            HireDate: candidate.customDate2,
            VIDateCompleted: candidate.customDate3,
            ReferralRewardPaid: candidate.customDate4,
            Vax1stDoseDate: candidate.customDate5,
            MidAssignmentEvalSendDate: candidate.customDate6,
            Vax2ndDoseDate: candidate.customDate7,
            VaxBoosterDate: candidate.customDate8,
            NextContactDate: candidate.customDate9,
            PackageName: candidate.customEncryptedText1,
            ConverzAIPendingFollowUp: candidate.customEncryptedText10,
            ReportOrderDate: candidate.customEncryptedText2,
            CaseStatus: candidate.customEncryptedText3,
            InstantScreeningsStatus: candidate.customEncryptedText4,
            CountyCriminalStatus: candidate.customEncryptedText5,
            DrugStatus: candidate.customEncryptedText6,
            CustomEncryptedText7: candidate.customEncryptedText7,
            CustomEncryptedText8: candidate.customEncryptedText8,
            CustomEncryptedText9: candidate.customEncryptedText9,
            BenefitsWeeklyDeduction: candidate.customFloat1,
            customFloat10: candidate.customFloat10,
            CustomFloat11: candidate.customFloat11,
            CustomFloat12: candidate.customFloat12,
            CustomFloat13: candidate.customFloat13,
            CustomFloat14: candidate.customFloat14,
            CustomFloat15: candidate.customFloat15,
            CustomFloat16: candidate.customFloat16,
            CustomFloat17: candidate.customFloat17,
            CustomFloat18: candidate.customFloat18,
            CustomFloat19: candidate.customFloat19,
            LeadBenefits: candidate.customFloat2,
            CustomFloat20: candidate.customFloat20,
            CustomFloat21: candidate.customFloat21,
            CustomFloat22: candidate.customFloat22,
            CustomFloat23: candidate.customFloat23,
            YearsOfRelevantExperience: candidate.customFloat3,
            MaximumHoursPerWeek: candidate.customFloat4,
            CustomFloat5: candidate.customFloat5,
            CustomFloat6: candidate.customFloat6,
            CustomFloat7: candidate.customFloat7,
            CustomFloat8: candidate.customFloat8,
            CustomFloat9: candidate.customFloat9,
            ReferencesStatus: candidate.customInt1,
            FMPSurveyResponse: candidate.customInt10,
            MedicalWaiver: candidate.customInt11,
            PayproID: candidate.customInt12,
            BenefitsWaiverStatus: candidate.customInt13,
            AppInstalled: candidate.customInt14,
            YearsOfSecondaryExperience: candidate.customInt15,
            PastTraveler: candidate.customInt16,
            NCSBNIDNursys: candidate.custom,
            ReferencesStatus: candidate.customText31,
            SenseEmail: candidate.customText32,
            MissingExpiringNotesQA: candidate.customText33,
            Recruiter: candidate.customText34,
            LucySource: candidate.customText35,
            VivianJobAppTemp: candidate.customText36,
            Last4SSN: candidate.customText37,
            FusionVivianLink: candidate.customText38,
            EMR: candidate.customText39,
            DesiredLocationCity: candidate.customText4,
            YearsOfTotalNursingExperience: candidate.customText40,
            InterestedInPerDiem: candidate.customText5,
            TimeOffRequest: candidate.customText6,
            MarketingOptIn: candidate.customText7,
            MaidenName: candidate.customText8,
            InfluencedByBot: candidate.customText9,
            SpecificLocationsOfInterest: candidate.customTextBlock1,
            AdditionalDetails: candidate.customTextBlock10,
            TalentQuestionnaire: candidate.customTextBlock2,
            Specialty: candidate.customTextBlock3,
            RetentionNotes: candidate.customTextBlock4,
            VINotes: candidate.customTextBlock5,
            SellingPoints: candidate.customTextBlock6,
            NewTalentQuestionnaire: candidate.customTextBlock7,
            JobMatchNotes: candidate.customTextBlock8,
            TravelExp: candidate.customTextBlock9,
            DateAdded: candidate.dateAdded,
            DateAvailable: candidate.dateAvailable,
            LatestDateAvailable: candidate.dateAvailableEnd,
            DateI9Expiration: candidate.dateI9Expiration,
            LastNote: candidate.dateLastComment,
            DateLastModified: candidate.dateLastModified,
            DateLastPayrollProviderSync: candidate.dateLastPayrollProviderSync,
            DateNextCall: candidate.dateNextCall,
            Birthday: candidate.dateOfBirth,
            DayRate: candidate.dayRate,
            DayRateLow: candidate.dayRateLow,
            Degree: candidate.degreeList,
            Resume: candidate.description,
            DesiredLocationsStates: candidate.desiredLocations,
            Disability: candidate.disability,
            EducationLevel: candidate.educationDegree,
            Education: candidate.educations,
            Email: candidate.email,
            Email2: candidate.email2,
            Email3: candidate.email3,
            EmployeeType: candidate.employeeType,
            EmploymentPreference: candidate.employmentPreference,
            EStaffGUID: candidate.estaffGUID,
            Ethnicity: candidate.ethnicity,
            YearsOfTotalNursingExperience: candidate.experience,
            OpusID: candidate.externalID,
            Fax: candidate.fax,
            PendingLicenseCerts: candidate.fax2,
            FilterFields: candidate.fax3,
            FederalAddtionalWitholdingsAmount:
              candidate.federalAddtionalWitholdingsAmount,
            FederalExemptions: candidate.federalExemptions,
            FederalExtraWithholdingAmount:
              candidate.federalExtraWithholdingAmount,
            FederalFilingStatus: candidate.federalFilingStatus,
            FileAttachments: candidate.fileAttachments,
            FirstName: candidate.firstName,
            Gender: candidate.gender,
            DesiredPayRate: candidate.hourlyRate,
            CurrentPayRate: candidate.hourlyRateLow,
            I9OnFile: candidate.i9OnFile,
            Interviews: candidate.interviews,
            IsAnonymized: candidate.isAnonymized,
            IsDaylightSavings: candidate.isDayLightSavings,
            IsDeleted: candidate.isDeleted,
            AllowCandidateToEditProfile: candidate.isEditable,
            IsExempt: candidate.isExempt,
            IsLockedOut: candidate.isLockedOut,
            LastName: candidate.lastName,
            Leads: candidate.leads,
            LinkedPerson: candidate.linked,
            Person: candidate.linkedPerson,
            Address: candidate.address,
            City: candidate.city,
            State: candidate.state,
            ZipCode: candidate.zip,
            CountryID: candidate.countryID,
            HomePhone: candidate.homePhone,
            MobilePhone: candidate.mobilePhone,
            WorkPhone: candidate.workPhone,
            MailingAddress: candidate.mailingAddress,
            MarketingCampaigns: candidate.marketingCampaigns,
            MiddleName: candidate.middleName,
            NamePrefix: candidate.namePrefix,
            NameSuffix: candidate.nameSuffix,
            Nickname: candidate.nickName,
            Notes: candidate.notes,
            NumCategories: candidate.numCategories,
            NumOwners: candidate.numOwners,
            NumberOfDependents: candidate.numberOfDependents,
            Occupation: candidate.occupation,
            OfficeBranch: candidate.officeBranch,
            OfficeBranchID: candidate.officeBranchID,
            OwnerID: candidate.ownerID,
            Owners: candidate.owners,
            Pager: candidate.pager,
            PaperWorkOnFile: candidate.paperWorkOnFile,
            PreferredContact: candidate.preferredContact,
            PrimarySkills: candidate.primarySkills,
            PriorWorkHistory: candidate.priorWorkHistory,
            RecentPlacements: candidate.recentPlacements,
            ReferredBy: candidate.referredBy,
            ReferredByPerson: candidate.referredByPerson,
            Referrals: candidate.referrals,
            ReportsTo: candidate.reportsTo,
            Salary: candidate.salary,
            SecondaryOwners: candidate.secondaryOwners,
            SecondarySkills: candidate.secondarySkills,
            SkillCategories: candidate.skillCategories,
            SkillSet: candidate.skillSet,
            SMSOptIn: candidate.smsOptIn,
            Source: candidate.source,
            SpecialtyCategoryID: candidate.specialtyCategoryID,
            SSN: candidate.ssn,
            Status: candidate.status,
            Submissions: candidate.submissions,
            Tasks: candidate.tasks,
            TimeZoneOffsetEST: candidate.timeZoneOffsetEST,
            Title: candidate.title,
            TravelLimit: candidate.travelLimit,
            UserType: candidate.userType,
            VMSWebsite: candidate.vmsWebsite,
            WillRelocate: candidate.willRelocate,
            WorkAuthorized: candidate.workAuthorized,
            WorkHistory: candidate.workHistories,
            CustomObject1: candidate.customObject1,
            CustomObject2: candidate.customObject2,
            CustomObject3: candidate.customObject3,
            // CustomObject4: candidate.customObject4,
            // CustomObject5: candidate.customObject5,
            // CustomObject6: candidate.customObject6,
            // CustomObject7: candidate.customObject7,
            // CustomObject8: candidate.customObject8,
            // CustomObject9: candidate.customObject9,
            // CustomObject10: candidate.customObject10,
          };
          console.log("candidate", candidateData);
        }
      }
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}
