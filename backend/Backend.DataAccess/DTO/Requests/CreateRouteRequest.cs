namespace Backend.DataAccess.DTO.Requests;

public class CreateRouteRequest
{
    public required double Latitude { get; set; }

    public required double Longitude { get; set; }

    // public required string Address { get; set; }
    //
    // public required DateTime TimeStamp { get; set; }
}