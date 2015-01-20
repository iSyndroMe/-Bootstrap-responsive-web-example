using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace myRentalCarProject
{
    [Serializable]
    public class Car
    {
        public string Model { get; set; }
        public int Year { get; set; }
        public string LicensePlateNumber { get; set; }
        public string Color { get; set; }
        public string Gear { get; set; }
        public bool IsAvailable { get; set; }

    }
}
