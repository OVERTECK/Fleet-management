namespace Backend.DataAccess.DTO.Requests;

public class CreateRouteRequest
{
    public required double Latitude { get; init; }

    public required double Longitude { get; init; }

    public required string Address { get; init; }

    public required DateTime TimeStamp { get; init; }
}