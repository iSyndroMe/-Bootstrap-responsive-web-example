using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace myRentalCarProject
{
    [Serializable]
    public class Clients
    {
        public string Username { get; set; }
        public int Id { get; set; }
        public int Phone { get; set; }
        public int Mobile { get; set; }
        public string Email { get; set; }
        public int LicenseNumber { get; set; }
        public int BirthDate { get; set; }

    }
}